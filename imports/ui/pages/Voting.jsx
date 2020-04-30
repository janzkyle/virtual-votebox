import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { makeStyles, Grid, Button, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { Voted } from '../../api/voted';
import { Votes } from '../../api/votes';
import { Positions } from '../../api/positions';

import PositionComponent from '../components/PositionComponent';
import Loader from '../components/Loader';
import VoteModal from '../components/VoteModal';
import ConfirmModal from '../components/ConfirmModal';
import {
  groupCandidates,
  insertCandidatesToPositions,
} from '../../util/helper';

const useStyles = makeStyles((theme) => ({
  loader: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    WebkitTransform: 'translate(-50%, -50%)',
    transform: 'translate(-50%, -50%)',
  },
  root: {
    padding: theme.spacing(4, 2),
    flexDirection: 'column',
    backgroundColor: theme.palette.primary.light
  },
  alert: {
    margin: theme.spacing(-4, -2, 0),
  },
  submit: {
    justifyContent: 'center',
  },
}));

const useVoted = () =>
  useTracker(() => {
    Meteor.subscribe('voted');
    const voted = Voted.find().fetch();
    return !!voted.length;
  }, []);

const useCandidates = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('candidates');
    const candidates = Votes.find().fetch();
    return { candidates, candidatesLoaded: subscription.ready() };
  }, []);

const usePositions = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('positions');
    const positions = Positions.find().fetch();
    return { positions, positionsLoaded: subscription.ready() };
  }, []);

const Voting = () => {
  const classes = useStyles();

  const [votes, setVotes] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);

  const hasVoted = useVoted();
  const { candidates, candidatesLoaded } = useCandidates();
  const { positions, positionsLoaded } = usePositions();
  const grouped = groupCandidates(candidates, 'position');
  const ballot = insertCandidatesToPositions(positions, grouped);

  const handleVoteChange = (position, value) => {
    let tempVotes = { ...votes };
    tempVotes[position] = value.filter(Boolean);
    setVotes(tempVotes);
  };

  const openModal = (e) => {
    e.preventDefault();
    setOpenConfirm(true)
  }

  const handleVoteSubmit = (e) => {
    e.preventDefault();

    if (hasVoted) {
      setError('Already voted. You cannot vote more than once');
      return;
    }

    for (const position of positions) {
      const voteIds = votes[position.position];
      const requiredVotes = Math.min(
        position.votesPerPerson,
        grouped[position.position].length - position.withAbstain
      );
      if (voteIds === undefined || requiredVotes !== voteIds.length) {
        setError(`Vote for ${position.position} is required`);
        setOpenConfirm(false);
        return;
      }
    }

    setError('');
    Meteor.call('votes.update', Object.values(votes).flat(1), (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setSuccess('Your vote has successfully been recorded!');
      }
    });
    setOpenConfirm(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [error, success]);

  return candidatesLoaded && positionsLoaded ? (
    <Grid container className={classes.root}>
      <VoteModal hasVoted={hasVoted} />
      {error && (
        <Alert severity='error' className={classes.alert}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity='success' className={classes.alert}>
          {success}
        </Alert>
      )}
      <Grid item sm={12}>
        <Typography align='center' component='h2' variant='h4'>
          Ballot
        </Typography>
      </Grid>
      <form>
        <Grid item sm={12}>
          {ballot.map((position) => (
            <PositionComponent
              handleVoteChange={handleVoteChange}
              key={position._id}
              {...position}
            />
          ))}
        </Grid>
        <Grid container item className={classes.submit}>
          <Grid item xs={12} md={4}>
            <Button
              variant='contained'
              fullWidth
              color='primary'
              disableElevation
              onClick={openModal}
              disabled={hasVoted}
            >
              Submit Votes
            </Button>
          </Grid>
        </Grid>
        <ConfirmModal
          openConfirm={openConfirm}
          setOpenConfirm={setOpenConfirm}
          handleVoteSubmit={handleVoteSubmit}
        />
      </form>
    </Grid>
  ) : (
    <Loader />
  );
};

export default Voting;

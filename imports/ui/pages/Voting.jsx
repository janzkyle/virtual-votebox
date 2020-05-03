import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import {
  makeStyles,
  Grid,
  Button,
  Typography,
  Backdrop,
} from '@material-ui/core';
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
    backgroundColor: theme.palette.primary.light,
  },
  alert: {
    margin: theme.spacing(-4, -2, 0),
  },
  form: {
    justifyContent: 'center',
  },
  submit: {
    justifyContent: 'center',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const useVoted = () =>
  useTracker(() => {
    Meteor.subscribe('voted');
    const voted = Voted.find({ userId: Meteor.userId() }).fetch();
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
  const [openBackdrop, setOpenBackdrop] = useState(false);

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
    setOpenConfirm(true);
  };

  const handleVoteSubmit = (e) => {
    e.preventDefault();
    setOpenConfirm(false);
    setOpenBackdrop(true);
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
        setOpenBackdrop(false);
        setError(`Vote for ${position.position} is required`);
        return;
      }
    }

    setError('');
    Meteor.call('votes.update', Object.values(votes).flat(1), (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setOpenBackdrop(false);
        setSuccess(
          'Your vote has successfully been recorded! Go to Dashboard to see the tally'
        );
      }
    });
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
        <Grid item container className={classes.form}>
          <Grid item sm={10}>
            {ballot.map((position) => (
              <PositionComponent
                handleVoteChange={handleVoteChange}
                key={position._id}
                {...position}
              />
            ))}
          </Grid>
          <Grid container item className={classes.submit}>
            <Grid item xs={12} sm={4}>
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
        </Grid>
        <ConfirmModal
          openConfirm={openConfirm}
          setOpenConfirm={setOpenConfirm}
          handleVoteSubmit={handleVoteSubmit}
        />
        <Backdrop className={classes.backdrop} open={openBackdrop}>
          <Loader />
        </Backdrop>
      </form>
    </Grid>
  ) : (
    <Loader />
  );
};

export default Voting;

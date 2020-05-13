import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { makeStyles, Grid, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Voted } from '../../api/voted';
import { Votes } from '../../api/votes';
import { Positions } from '../../api/positions';

import Loader from '../components/Loader';
import CandidatesTally from '../components/CandidatesTally';
import {
  groupCandidates,
  insertCandidatesToPositions,
} from '../../util/helper';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 2),
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.light,
  },
  paper: {
    margin: theme.spacing(2, 0),
  },
  voteCount: {
    fontWeight: 'bold',
    margin: theme.spacing(4, 0, 0),
  },
  position: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    fontWeight: 600,
    padding: theme.spacing(1, 1),
  },
  tableHeader: {
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
  },
}));

const useVoteCount = () =>
  useTracker(() => {
    Meteor.subscribe('voted');
    const totalVotes = Voted.find().count();
    const voted = Voted.find({ userId: Meteor.userId() }).fetch();
    return { totalVotes, hasVoted: !!voted.length };
  }, []);

const useTallies = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('tallies');
    const candidates = Votes.find().fetch();
    return { candidates, candidatesLoaded: subscription.ready() };
  }, []);

const usePositions = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('positions');
    const positions = Positions.find().fetch();
    return { positions, positionsLoaded: subscription.ready() };
  }, []);

const Dashboard = () => {
  const classes = useStyles();
  const { totalVotes, hasVoted } = useVoteCount();
  const { candidates, candidatesLoaded } = useTallies();
  const { positions, positionsLoaded } = usePositions();

  const grouped = groupCandidates(candidates, 'position');
  const positionTallies = insertCandidatesToPositions(positions, grouped);

  return candidatesLoaded && positionsLoaded ? (
    <Grid container className={classes.root}>
      <Grid item sm={12}>
        <Typography align='center' component='h2' variant='h4'>
          Dashboard
        </Typography>
      </Grid>
      <Grid item sm={7}>
        <Typography component='h3' variant='h5' className={classes.voteCount}>
          Total votes casted: {totalVotes}
        </Typography>
      </Grid>
      {hasVoted ? (
        positionTallies.map((tallies) => (
          <Grid item sm={7} key={tallies._id}>
            <Paper className={classes.paper}>
              <Typography variant='h6' className={classes.position}>
                {tallies.position}
              </Typography>
              <Table aria-label='simple table'>
                <colgroup>
                  <col style={{ width: '40%' }} />
                  <col style={{ width: '30%' }} />
                  <col style={{ width: '30%' }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeader}>
                      Candidate
                    </TableCell>
                    <TableCell align='right' className={classes.tableHeader}>
                      Votes
                    </TableCell>
                    <TableCell align='right' className={classes.tableHeader}>
                      Percentage
                    </TableCell>
                  </TableRow>
                </TableHead>
                <CandidatesTally tallies={tallies.candidates}></CandidatesTally>
              </Table>
            </Paper>
          </Grid>
        ))
      ) : (
        <Grid item sm={7}>
          <Typography>Summary of votes is not yet available</Typography>
        </Grid>
      )}
    </Grid>
  ) : (
    <Loader />
  );
};

export default Dashboard;

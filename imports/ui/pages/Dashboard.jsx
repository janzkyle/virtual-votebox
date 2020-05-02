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
    // flexDirection: 'column',
    justifyContent: 'center',
    // alignContent: 'center',
    backgroundColor: theme.palette.primary.light,
  },
  paper: {
    padding: theme.spacing(3,3),
    margin: theme.spacing(2,0)
  },
}));

const useVoteCount = () =>
  useTracker(() => {
    Meteor.subscribe('totalVoted');
    const totalVotes = Voted.find().count();
    return totalVotes;
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
  const totalVotes = useVoteCount();
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
      <Grid item sm={10}>
        <Typography component='h3' variant='h5'>
          Total votes casted: {totalVotes}
        </Typography>
      </Grid>
      {positionTallies.map((tallies) => (
        <Grid item sm={10} key={tallies._id}>
          <Paper className={classes.paper}>
            <Typography variant='h6'>{tallies.position}</Typography>
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align='right'>Votes</TableCell>
                  <TableCell align='right'>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <CandidatesTally tallies={tallies.candidates}></CandidatesTally>
            </Table>
          </Paper>
        </Grid>
      ))}
      {/* {positionTallies.map((tallies) => (
        <div key={tallies._id}>
          <h4>{tallies.position}</h4>
          <CandidatesTally tallies={tallies.candidates}></CandidatesTally>
        </div>
      ))} */}
    </Grid>
  ) : (
    <Loader />
  );
};

export default Dashboard;

import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { makeStyles, Grid, Typography } from '@material-ui/core';

import { Voted } from '../../api/voted';

import Loader from '../components/Loader';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 2),
    justifyContent: 'center',
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
    const subscription = Meteor.subscribe('voted');
    const totalVotes = Voted.find().count();
    return { totalVotes, totalVotesLoaded: subscription.ready() };
  }, []);

const Dashboard = () => {
  const classes = useStyles();
  const { totalVotes, totalVotesLoaded } = useVoteCount();

  return totalVotesLoaded ? (
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
      <Grid item sm={7}>
        <Typography>Summary of votes is not yet available</Typography>
      </Grid>
    </Grid>
  ) : (
    <Loader />
  );
};

export default Dashboard;

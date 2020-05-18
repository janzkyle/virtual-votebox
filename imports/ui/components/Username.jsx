import React from 'react';
import { makeStyles, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 2),
    flexDirection: 'row-reverse',
    backgroundColor: theme.palette.primary.light,
  },
}));

const Username = ({ user }) => {
  const classes = useStyles();

  return user ? (
    <Grid container className={classes.root}>
      <Grid item xs={6}>
        <Typography component='h3' variant='body2' align='right'>
          Logged in as: {user.profile.name}
        </Typography>
      </Grid>
    </Grid>
  ) : (
    <></>
  );
};

export default Username;

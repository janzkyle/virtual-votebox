import { Meteor } from 'meteor/meteor';

import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  Hidden,
  TextField,
  Typography,
  Box,
  Fab,
} from '@material-ui/core';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import { useHistory, useLocation } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  titleContainer: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(10, 4, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoAndTitle: {
    padding: theme.spacing(0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  description: {
    color: theme.palette.secondary.main,
  },
  img: {
    maxHeight: 100,
    margin: theme.spacing(5, 15, 0),
  },
  svg: {
    fill: theme.palette.secondary.main,
    height: 100,
    width: 100,
  },
  paper: {
    padding: theme.spacing(7, 2, 0),
  },
  login: {
    padding: theme.spacing(1, 4),
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    [`& fieldset`]: {
      borderRadius: 25,
    },
  },
  submit: {
    margin: theme.spacing(5, 0, 2),
    padding: theme.spacing(0, 7),
    alignSelf: 'center',
  },
}));

const Login = () => {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const hasLogo = false;

  useEffect(() => {
    if (Meteor.userId()) {
      history.replace('/vote');
    }
  }, []);

  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: '/vote' } };

  const handleSubmit = (e) => {
    e.preventDefault();
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        let errMsg = '';
        switch (err.error) {
          case 400:
            errMsg = 'Enter your email and password';
            break;
          case 403:
            errMsg = err.reason;
            break;
        }
        setError(errMsg);
        setPassword('');
      } else {
        history.replace(from);
      }
    });
  };

  const logoAndTitle = (isMobile = false) => (
    <>
      {hasLogo ? (
        <img
          src='/logo.png'
          className={classes.img}
        />
      ) : (
        <HowToVoteIcon className={classes.svg} />
      )}
      <Typography component='h1' variant='h4'>
        <Box textAlign='center' m={1} color={isMobile ? '' : 'white'}>
          Virtual Votebox
        </Box>
      </Typography>
    </>
  );

  return (
    <Grid container component='main' className={classes.root}>
      <Hidden xsDown>
        <Grid item sm={7} className={classes.titleContainer}>
          {logoAndTitle()}
          <Typography
            component='h2'
            variant='h6'
            className={classes.description}
          >
            Secure Online Voting for Organizations
          </Typography>
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={5} className={classes.paper}>
        <Grid item className={classes.logoAndTitle}>
          <Hidden smUp>{logoAndTitle((isMobile = true))}</Hidden>
        </Grid>
        <Grid item className={classes.login}>
          <Hidden xsDown>
            <Typography component='h2' variant='h4'>
              <Box textAlign='center' m={1}>
                Sign in
              </Box>
            </Typography>
          </Hidden>
          <form className={classes.form} onSubmit={handleSubmit}>
            {error && <Typography color='error'>{error}</Typography>}
            <TextField
              label='Email'
              type='email'
              margin='normal'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              className={classes.textField}
              variant='outlined'
            />
            <TextField
              label='Password'
              type='password'
              margin='normal'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              className={classes.textField}
              variant='outlined'
            />
            <Fab
              type='submit'
              color='primary'
              className={classes.submit}
              variant='extended'
            >
              Login
            </Fab>
          </form>
          <Typography variant='subtitle2' align='center'>
            Check your mailbox for sign-in credentials
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;

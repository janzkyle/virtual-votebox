import { Meteor } from 'meteor/meteor';

import React, { useState, useEffect } from 'react';
import { makeStyles, CssBaseline, Grid, Paper, TextField, Button } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (Meteor.userId()) {
      history.replace('/dashboard');
    }
  }, []);

  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: '/dashboard' } };

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

  return (
    <Grid container component='main' className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <form
            className={classes.form}
            onSubmit={handleSubmit}
          >
            {error && <h2>{error}</h2>}
            <TextField
              label='Email'
              variant='outlined'
              margin='normal'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label='Password'
              type='password'
              variant='outlined'
              margin='normal'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              className={classes.submit}
            >
              Login
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;

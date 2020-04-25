import { Meteor } from 'meteor/meteor';

import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  CssBaseline,
  Grid,
  Hidden,
  TextField,
  Typography,
  Button,
  Box,
  Fab
} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  img: {
    maxWidth: '100%',
    padding: theme.spacing(0, 15, 1)
  },
  paper: {
    padding: theme.spacing(12, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  login: {
    padding: theme.spacing(1, 0),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  textField: {
    [`& fieldset`]: {
      borderRadius: 25,
    },
  },
  submit: {
    margin: theme.spacing(5, 0, 2),
    padding: theme.spacing(0, 5)
  }
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
      <Hidden xsDown>
        <Grid item sm={7} className={classes.image} />
      </Hidden>
      <Grid item container xs={12} sm={5} className={classes.paper}>
        <Grid item>
          <Hidden smUp>
            <div>
              <img src='/logo.png' className={classes.img} />
            </div>
            <Typography component='h1' variant='h5'>
              <Box textAlign='center' m={1}>
                Virtual Votebox
              </Box>
            </Typography>
          </Hidden>
        </Grid>
        <Grid item className={classes.login}>
          <Hidden xsDown>
            <Typography component='h1' variant='h5'>
              <Box textAlign='center' m={1}>
                Sign in
              </Box>
            </Typography>
          </Hidden>
          <form className={classes.form} onSubmit={handleSubmit}>
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
              className={classes.textField}
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
              className={classes.textField}
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
          <Grid container>
            <Grid item xs>
              <Typography variant="subtitle2">
                Check your mailbox for sign-in credentials
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;

import { Meteor } from 'meteor/meteor';

import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';

const Login = () => {
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
    <form autoComplete='off' onSubmit={handleSubmit}>
      {error && <h2>{error}</h2>}
      <TextField
        label='Email'
        variant='outlined'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        autoFocus
      />
      <TextField
        label='Password'
        type='password'
        variant='outlined'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button
        type='submit'
        variant='contained'
        color='primary'
        fullWidth
        disableElevation
      >
        Login
      </Button>
    </form>
  );
};

export default Login;

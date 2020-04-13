import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (input) => {};

  return (
    <form autoComplete='off'>
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

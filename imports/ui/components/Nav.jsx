import { Meteor } from 'meteor/meteor'

import React from 'react'
import { Container, Button } from '@material-ui/core';
import { useHistory } from 'react-router';

const Nav = () => {
  let history = useHistory();

  const handleLogout = (e) => {
    e.preventDefault()
    Meteor.logout((err) => {
      if (!err) {
        console.log("time ka na boi extend ka na")
        history.push('/login')
      }
    })
  }

  return (
    <Container>
      <h2>AECES Online Elections</h2>
      {Meteor.userId() ?
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disableElevation
          onClick={handleLogout}
        >
          Logout
        </Button>
        : ''
      }
    </Container>
  )
}

export default Nav

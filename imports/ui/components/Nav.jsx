import React from 'react';
import { makeStyles, Grid, Button } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  nav: {
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.primary.main,
    color: 'white'
  },
  title: {
    display: 'flex',
    alignItems: 'center'
  },
  logout: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  logoutIcon: {
    cursor: 'pointer'
  }
}));

const Nav = () => {
  const classes = useStyles();
  let history = useHistory();

  const handleLogout = (e) => {
    e.preventDefault();
    Meteor.logout((err) => {
      if (!err) {
        console.log('time ka na boi extend ka na');
        history.push('/login');
      }
    });
  };

  return (
    <nav className={classes.nav}>
      <Grid container>
        <Grid item xs={8} className={classes.title}>
          <h2>Virtual Votebox</h2>
        </Grid>
        <Grid item xs={4} className={classes.logout}>
          <ExitToAppIcon
            type='submit'
            className={classes.logoutIcon}
            onClick={handleLogout}
          />
          {/* <Button
            variant='outlined'
            type='submit'
            color='secondary'
            onClick={handleLogout}
          >
            LOGOUT
          </Button> */}
        </Grid>
      </Grid>
    </nav>
  );
};

export default Nav;

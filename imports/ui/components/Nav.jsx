import React from 'react';
import {
  makeStyles,
  Grid,
  useMediaQuery,
  Button,
  Link,
  Hidden,
  AppBar,
  Tabs,
  Tab,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  nav: {
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
  },
  links: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    margin: theme.spacing(0, 2),
  },
  logout: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(0, 2),
  },
  logoutIcon: {
    cursor: 'pointer',
  },
  appbar: {
    backgroundColor: 'white'
  }
}));

const Nav = () => {
  let history = useHistory();
  const classes = useStyles();
  const [value, setValue] = React.useState(history.location.pathname === '/dashboard' ? 0 : 1);
  const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  const handleChange = (event, newValue) => {
    if(newValue === 0) {
      history.push('/dashboard');
    } else {
      history.push('/vote');
    }
    setValue(newValue)
  };

  const handleLogout = (e) => {
    e.preventDefault();
    Meteor.logout((err) => {
      if (!err) {
        history.push('/login');
      }
    });
  };

  return (
    <nav>
      <Grid container>
        <Grid container item className={classes.nav}>
          <Grid item xs={8} md={4} className={classes.title}>
            <h2>Virtual Votebox</h2>
          </Grid>
          <Grid item xs={4} md={8} className={classes.logout}>
            <Hidden xsDown>
              {/* <Link href='/dashboard' variant='h6' className={classes.link}>
                Dashboard
              </Link> */}
              <Link href='/vote' variant='h6' className={classes.link}>
                Vote
              </Link>
            </Hidden>
            {matches ? (
              <Button
                variant='outlined'
                type='submit'
                color='secondary'
                onClick={handleLogout}
                className={classes.button}
              >
                LOGOUT
              </Button>
            ) : (
              <ExitToAppIcon
                type='submit'
                className={classes.logoutIcon}
                onClick={handleLogout}
              />
            )}
          </Grid>
        </Grid>
        <Hidden smUp>
          <Grid item xs={12}>
            <AppBar position='static' className={classes.appbar}>
              <Tabs
                value={value}
                onChange={handleChange}
                textColor='secondary'
                indicatorColor='secondary'
                variant='fullWidth'
              >
                <Tab label='Dashboard' component={Link} to='/dashboard' />
                <Tab label='Vote' component={Link} to='/vote' />
              </Tabs>
            </AppBar>
          </Grid>
        </Hidden>
      </Grid>
    </nav>
  );
};

export default Nav;

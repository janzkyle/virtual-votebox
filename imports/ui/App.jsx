import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import { createBrowserHistory } from 'history';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Voting from './pages/Voting';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      'Roboto',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
  ].join(',')
  },
  palette: {
    primary: {
      main: '#273236',
    },
    secondary: {
      main: '#0091EA',
      light: '#e8eaf6',
    },
  },
});

const browserHistory = createBrowserHistory();

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router history={browserHistory}>
        <Switch>
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          <PrivateRoute exact path='/vote' component={Voting} />
          <Route exact path='/login' component={Login} />
          <Redirect to={Meteor.userId() ? '/dashboard' : '/login'} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

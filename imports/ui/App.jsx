import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import { createBrowserHistory } from 'history';
import { makeStyles, CssBaseline} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import PrivateRoute from './components/PrivateRoute';
import Nav from './components/Nav';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Voting from './pages/Voting';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0091EA'
    },
    secondary: {
      main: '#273236'
    },
  },
});

const browserHistory = createBrowserHistory();

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router history={browserHistory}>
        {/* <Nav /> */}
        <Switch>
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          <PrivateRoute exact path='/vote' component={Voting} />
          <Route exact path='/login' component={Login} />
          <Redirect to={Meteor.userId() ? '/dashboard' : '/login'} />
        </Switch>
      </Router>
    </ThemeProvider>
    // </Container>
  );
};

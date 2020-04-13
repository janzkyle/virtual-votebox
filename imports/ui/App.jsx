import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import { createBrowserHistory } from 'history';
import CssBaseline from '@material-ui/core/CssBaseline';

import Nav from './components/Nav';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Voting from './pages/Voting';

const browserHistory = createBrowserHistory();

export const App = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Router history={browserHistory}>
        <Nav />
        {Meteor.userId() ? (
          <Switch>
            <Route exact path='/dashboard' component={Dashboard} />
            <Route exact path='/vote' component={Voting} />
            <Redirect from='*' to='/dashboard' />
          </Switch>
        ) : (
          <Switch>
            <Route exact path='/login' component={Login} />
            <Redirect from='*' to='/login' />
          </Switch>
        )}
      </Router>
    </React.Fragment>
  );
};

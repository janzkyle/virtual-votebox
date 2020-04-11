import React from 'react'
import { Router, Route, Switch, Redirect } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import LoginPage from './pages/LoginPage'
import VotingPage from './pages/VotingPage'

const browserHistory = createBrowserHistory();

export const App = () => {
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/login" component={LoginPage}/>
      <Route exact path="/vote" component={VotingPage}/>
      <Route exact path="/dashboard" component={DashboardPage}/>
      <Redirect from="*" component={LoginPage}/>
    </Switch>
  </Router>
};

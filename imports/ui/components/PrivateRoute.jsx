import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Route, Redirect } from 'react-router';

import Nav from './Nav';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      Meteor.userId() ? (
        <>
          <Nav />
          <Component {...props} />
        </>
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default PrivateRoute;

import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Route, Redirect } from 'react-router';

const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log("tote")
  return (
    <Route
      {...rest}
      render={({location}) =>
          Meteor.userId() ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Route, Redirect } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';

import Nav from './Nav';
import Username from './Username';

const useAccount = () =>
  useTracker(() => {
    const user = Meteor.user();
    const userId = Meteor.userId();
    return {
      user,
      userId,
      isLoggedIn: !!userId,
    };
  }, []);

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn, user } = useAccount();

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <>
            <Nav />
            <Username user={user} />
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
};

export default PrivateRoute;

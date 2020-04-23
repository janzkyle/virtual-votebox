import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { Votes } from '../../api/votes';
import { Positions } from '../../api/positions';


const useTallies = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('tallies');
    const candidates = Votes.find().fetch();
    return { candidates, candidatesLoaded: subscription.ready() };
  }, []);

const usePositions = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('positions');
    const positions = Positions.find().fetch();
    return { positions, positionsLoaded: subscription.ready() };
  }, []);


const Dashboard = () => {
  const { candidates, candidatesLoaded } = useTallies();
  const { positions, positionsLoaded } = usePositions();
  if (candidatesLoaded && positionsLoaded) {
    console.log(candidates, positions)
  }
  return (
    <h1>Dashboard</h1>
  )
}

export default Dashboard
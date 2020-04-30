import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { Votes } from '../../api/votes';
import { Positions } from '../../api/positions';

import Loader from '../components/Loader';
import CandidatesTally from '../components/CandidatesTally';
import {
  groupCandidates,
  insertCandidatesToPositions,
} from '../../util/helper';

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

  const grouped = groupCandidates(candidates, 'position');
  const positionTallies = insertCandidatesToPositions(positions, grouped);

  if (candidatesLoaded && positionsLoaded) {
    console.log(positionTallies);
  }
  return candidatesLoaded && positionsLoaded ? (
    <>
      <h1>Dashboard</h1>
      {positionTallies.map((tallies) => (
        <div key={tallies._id}>
          <h4>{tallies.position}</h4>
          <CandidatesTally tallies={tallies.candidates}></CandidatesTally>
        </div>
      ))}
    </>
  ) : (
    <Loader />
  );
};

export default Dashboard;

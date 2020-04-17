import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { Votes } from '../../api/votes';
import { Positions } from '../../api/positions';

const getCandidates = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('candidates');
    const candidates = Votes.find().fetch();
    return [candidates, subscription.ready()];
  }, []);

const getPositions = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('positions');
    const positions = Positions.find().fetch();
    return [positions, subscription.ready()];
  }, []);

const groupCandidates = (obj, key) => {
  return obj.reduce((acc, candidate) => {
    (acc[candidate[key]] = acc[candidate[key]] || []).push(candidate);
    return acc;
  }, {});
};

const insertCandidatesToPositions = (positions, grouped) => {
  return positions.map((pos) => ({
    ...pos,
    candidates: grouped[pos.position],
  }));
};

const Voting = () => {
  const [hasVoted, sethasVoted] = useState(true);
  const [ballot, setBallot] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [candidatesRaw, candidatesLoaded] = getCandidates();
  const [positions, positionsLoaded] = getPositions();

  console.log(candidatesRaw);
  console.log(candidatesLoaded);

  console.log(positions);
  console.log(positionsLoaded);

  const grouped = groupCandidates(candidatesRaw, 'position');
  const candidates = insertCandidatesToPositions(positions, grouped);
  console.log(candidates)

  return <div>HOYBA</div>;
};

export default Voting;

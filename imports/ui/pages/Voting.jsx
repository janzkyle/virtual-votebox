import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { Votes } from '../../api/votes';
import { Positions } from '../../api/positions';

import PositionComponent from '../components/PositionComponent';

const useCandidates = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('candidates');
    const candidates = Votes.find().fetch();
    return { candidates, candidatesLoaded: subscription.ready() };
  }, []);

const usePositions = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('positions');
    const positions = Positions.find().fetch();
    return { positions, positionsLoaded: subscription.ready() };
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
  const [votes, setVotes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { candidates, candidatesLoaded } = useCandidates();
  const { positions, positionsLoaded } = usePositions();
  const grouped = groupCandidates(candidates, 'position');
  const ballot = insertCandidatesToPositions(positions, grouped);
  console.log(ballot);

  const handleVoteChange = (position, candidateId) => {

  }

  return (
    candidatesLoaded && positionsLoaded ? (
      <>
      {ballot.map(position => (<PositionComponent {...position} key={position._id} />))}
      </>
    ) : (
      <div>Loading</div>
    )
  );
};

export default Voting;

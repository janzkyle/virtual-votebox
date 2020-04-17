import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data'

import { Votes } from '../../api/votes';

const getCandidates = () => useTracker(() => {
  Meteor.subscribe('votes');
  const candidates = Votes.find({}, {fields: { name: 1, position: 1 }}).fetch();
  return candidates
}, []);

const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const Voting = () => {
  const [hasVoted, sethasVoted] = useState(true)
  const [ballot, setBallot] = useState([])
  const [showModal, setShowModal] = useState(false)

  const candidates = getCandidates()

  const positions = Array.from(
    new Set(candidates.map((candidate) => candidate.position))
  );
  
  console.log(candidates)

  // positions = groupBy(candidates, 'position')

  console.log(positions)
  
  return (
    <div>HOYBA</div>
  )
}

export default Voting
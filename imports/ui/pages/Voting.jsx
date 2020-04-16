import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data'

import { Votes } from '../../api/votes';

const getCandidates = () => useTracker(() => {
  Meteor.subscribe('votes');
  const candidates = Votes.find({}, {fields: { name: 1, position: 1 }}).fetch();
  return candidates
}, []);

const Voting = () => {
  const [hasVoted, sethasVoted] = useState(true)
  const [ballot, setBallot] = useState([])
  const [showModal, setShowModal] = useState(false)

  const candidates = getCandidates()
  
  console.log(candidates)
  
  return (
    <div>HOYBA</div>
  )
}

export default Voting
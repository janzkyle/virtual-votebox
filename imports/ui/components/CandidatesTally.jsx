import React from 'react';

const CandidatesTally = ({ tallies }) => {
  return (
    <div>
      {tallies.map((tally) => (
        <div key={tally._id}>
          {tally.name}: {tally.votes}
        </div>
      ))}
    </div>
  );
};

export default CandidatesTally;

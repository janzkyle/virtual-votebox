import React from 'react';
import CandidatesForm from './CandidatesForm';

const PositionComponent = ({ position, votesPerPerson, candidates }) => {
  const titles = [position];

  if (votesPerPerson > 1) {
    titles.pop();
    for (let i = 1; i <= votesPerPerson; i++) {
      titles.push(`${position}-${i}`);
    }
  }

  console.log(titles);
  return (
    <>
      {titles.map((title) => (
        <CandidatesForm position={title} candidates={candidates} key={title} />
      ))}
    </>
  );
};

export default PositionComponent;

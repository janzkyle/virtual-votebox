import React from 'react';
import CandidatesForm from './CandidatesForm';
import { FormControl, FormLabel } from '@material-ui/core';

const PositionComponent = ({ _id, position, votesPerPerson, candidates }) => {
  const titles = [position];

  if (votesPerPerson > 1) {
    titles.pop();
    for (let i = 1; i <= votesPerPerson; i++) {
      titles.push(`${position}-${i}`);
    }
  }

  return (
    <>
      {titles.map((title, i) => (
        <FormControl component="fieldset">
          <FormLabel component="legend">{title}</FormLabel>
          <CandidatesForm candidates={candidates} key={i.toString()} />
        </FormControl>
      ))}
    </>
  );
};

export default PositionComponent;

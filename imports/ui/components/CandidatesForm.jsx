import React from 'react';
import { Radio, RadioGroup, FormControlLabel } from '@material-ui/core';

const CandidatesForm = (props) => {
  const { candidates, selected, handleSelected, index } = props;

  const onChange = (event) => {
    handleSelected(index, event.target.value);
  };

  return (
    <RadioGroup value={selected} onChange={onChange}>
      {candidates.map((candidate) => (
        <FormControlLabel
          control={<Radio />}
          label={candidate.name}
          value={candidate._id}
          key={candidate._id}
        />
      ))}
    </RadioGroup>
  );
};

export default CandidatesForm;

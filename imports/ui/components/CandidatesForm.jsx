import React from 'react';
import { Radio, RadioGroup, FormControlLabel, Grid } from '@material-ui/core';

const CandidatesForm = (props) => {
  const { candidates, selected, handleSelected, index } = props;

  const onChange = (event) => {
    handleSelected(index, event.target.value);
  };

  return (
    <RadioGroup value={selected} onChange={onChange}>
      <Grid container>
        {candidates.map((candidate) => (
          <Grid item xs={12} sm={6} key={candidate._id}>
            <FormControlLabel
              control={<Radio />}
              label={candidate.name}
              value={candidate._id}
            />
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
};

export default CandidatesForm;

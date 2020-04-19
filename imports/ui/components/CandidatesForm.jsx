import React from 'react'
import { Radio, RadioGroup, FormControlLabel } from '@material-ui/core';

const CandidatesForm = ({ candidates }) => {
  return (
    <RadioGroup>
      {candidates.map(candidate => (
        <FormControlLabel value={candidate._id} control={<Radio />} label={candidate.name} key={candidate._id} />
      ))}
    </RadioGroup>
  )
}

export default CandidatesForm

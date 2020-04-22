import React, { useState, useRef, useEffect } from 'react';
import CandidatesForm from './CandidatesForm';
import { FormControl, FormLabel } from '@material-ui/core';

const PositionComponent = (props) => {
  const {
    position,
    votesPerPerson,
    candidates,
    withAbstain,
    handleVoteChange,
  } = props;

  const [voted, setVoted] = useState([]);

  const titles = [position];
  if (votesPerPerson > 1 && candidates.length - withAbstain > 1) {
    titles.pop();
    for (let i = 1; i <= votesPerPerson; i++) {
      titles.push(`${position}-${i}`);
    }
  }

  const abstainId =
    withAbstain &&
    candidates.find((candidate) => candidate.name == 'Abstain')._id;

  const handleSelected = (index, selected) => {
    if (selected == abstainId || !voted.includes(selected)) {
      const tempVoted = [...voted];
      tempVoted[index] = selected;
      setVoted(tempVoted);
    }
  };

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      handleVoteChange(position, voted);
    }
  }, [voted]);

  return (
    <div>
      {titles.length > 1 && (
        <div>You can only vote a candidate once except Abstain</div>
      )}
      {titles.map((title, i) => (
        <FormControl
          component='fieldset'
          fullWidth={true}
          required={true}
          key={i.toString()}
        >
          <FormLabel component='legend'>{title}</FormLabel>
          <CandidatesForm
            candidates={candidates}
            selected={voted[i] || ''}
            handleSelected={handleSelected}
            index={i}
          />
        </FormControl>
      ))}
    </div>
  );
};

export default PositionComponent;

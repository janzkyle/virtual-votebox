import React, { useState, useRef, useEffect } from 'react';
import CandidatesForm from './CandidatesForm';
import {
  makeStyles,
  FormControl,
  FormLabel,
  Paper,
  Typography,
  Divider,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(5, 0),
  },
  position: {
    margin: theme.spacing(0, -2),
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    fontWeight: 'bold',
  },
  candidates: {
    padding: theme.spacing(0, 2),
  },
  numberedTitle: {
    margin: theme.spacing(1, 0, 1),
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
  },
  note: {
    margin: theme.spacing(1, 0, 1),
    color: '#858585',
  },
}));

const PositionComponent = (props) => {
  const {
    position,
    votesPerPerson,
    candidates,
    withAbstain,
    handleVoteChange,
  } = props;

  const classes = useStyles();

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
    <Paper className={classes.paper}>
      {titles.map((title, i) => (
        <FormControl
          component='fieldset'
          fullWidth={true}
          required={true}
          key={i.toString()}
          className={classes.candidates}
        >
          {i == 0 && (
            <>
              <FormLabel className={classes.position}>{position}</FormLabel>
              <Typography variant='body2' className={classes.note}>
                You can only vote the same candidate once as{' '}
                {title.slice(0, -2)} except for Abstain
              </Typography>
            </>
          )}
          {titles.length > 1 && (
            <Typography variant='body1' className={classes.numberedTitle}>
              {title}
            </Typography>
          )}
          <CandidatesForm
            candidates={candidates}
            selected={voted[i] || ''}
            handleSelected={handleSelected}
            index={i}
            className={classes.candidates}
          />
          <Divider />
        </FormControl>
      ))}
    </Paper>
  );
};

export default PositionComponent;

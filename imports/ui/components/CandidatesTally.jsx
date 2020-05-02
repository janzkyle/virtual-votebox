import React from 'react';

import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const CandidatesTally = ({ tallies }) => {
  const totalVotes = tallies.reduce((total, curr) => total + curr.votes, 0);

  return (
    <TableBody>
      {tallies.map((row) => (
        <TableRow key={row._id}>
          <TableCell component='th' scope='row'>
            {row.name}
          </TableCell>
          <TableCell align='right'>{row.votes}</TableCell>
          <TableCell align='right'>
            {Math.round((row.votes / totalVotes) * 10000) / 100}%
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default CandidatesTally;

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

const VoteModal = ({ hasVoted }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };
  const [modalTitle, modalMsg] = hasVoted
    ? [
        <Typography align='center' color='error'>
          WARNING
        </Typography>,
        "You've already voted. You cannot vote anymore.",
      ]
    : [
        <Typography align='center' color='secondary'>
          TERMS & CONDITIONS
        </Typography>,
        <>
          As an official AECES member this S.Y. 2019-2020, you are eligible to
          vote for the candidates running to be the next Executive Board. It is
          your responsibility as a voter to (1) be knowledgeable of the plans
          and platforms of the candidates before voting and (2) to only vote
          according to your own decision and not anyone else's.
          <br />
          <br />
          The AECES COMELEC, on the other hand, is responsible for keeping any
          details that involve the identity of the voter confidential in any
          circumstances. Only details that would contribute to the overall
          tallying of votes for the elections will be gathered in order to
          determine the official list of elected Executive Board members for the
          incoming school year.
        </>,
      ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{modalTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {modalMsg}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          I understand
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoteModal;

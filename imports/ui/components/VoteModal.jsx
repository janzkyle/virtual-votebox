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
          {/* Change the text below for terms and conditions */}
          You are eligible to vote for the candidates listed in this ballot. It
          is your responsibility as a voter to only vote according to your own
          decision and not anyone else's.
          <br />
          <br />
          You can change the text in this modal by editing
          <i> /imports/ui/components/VoteModal.jsx</i>
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

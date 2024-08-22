import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

const ConfirmDeleteDialog = ({open,handleClose,deletehandler}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you want to delete this group?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={deletehandler} color="error" >YES</Button>
        </DialogActions>
    </Dialog>
  )
};

export default ConfirmDeleteDialog

import React from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PostDetailCard from '../../pages/Posted';

const PostDetailModal = ({ open, onClose, post }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <PostDetailCard post={post} />
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailModal;
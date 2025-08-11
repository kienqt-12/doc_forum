import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar,
  Avatar,
  IconButton,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Button
} from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '~/context/AuthContext';

const getIcon = (type) => {
  switch (type) {
    case 'like':
      return <ThumbUpAltIcon color="primary" fontSize="small" />;
    case 'comment':
      return <CommentIcon color="info" fontSize="small" />;
    case 'follow':
      return <PersonAddIcon color="success" fontSize="small" />;
    default:
      return <Avatar sx={{ width: 28, height: 28 }}>N</Avatar>;
  }
};

const NotiDropdown = () => {
  const { firebaseUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [processing, setProcessing] = useState({}); // id -> 'accept' | 'reject'

  const fetchRequests = useCallback(async () => {
    if (!firebaseUser) return;
    setLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch('http://localhost:8017/v1/friends/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Không lấy được lời mời');
      }
      const data = await res.json();
      setReceived(data.received || []);
      setSent(data.sent || []);
    } catch (err) {
      console.error('Lỗi load friend requests:', err);
      setSnackbar({ open: true, message: err.message || 'Lỗi tải lời mời', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const callAction = async (action, id) => {
    try {
      setProcessing((prev) => ({ ...prev, [id]: action })); // show spinner
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`http://localhost:8017/v1/friends/${action}/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Lỗi máy chủ');

      // Optimistic UI: remove from list ngay
      if (action === 'accept' || action === 'reject') {
        setReceived((prev) => prev.filter((r) => r._id !== id));
      }
      setSnackbar({ open: true, message: data.message || 'Thành công', severity: 'success' });
    } catch (err) {
      console.error(`Lỗi ${action}:`, err);
      setSnackbar({ open: true, message: err.message || 'Lỗi', severity: 'error' });
    } finally {
      setProcessing((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleAccept = (id) => callAction('accept', id);
  const handleReject = (id) => callAction('reject', id);

  const handleAcceptAll = async () => {
    for (const r of received) {
      await callAction('accept', r._id);
    }
  };

  return (
    <Box
      sx={{
        width: 360,
        maxHeight: 460,
        bgcolor: '#fff',
        boxShadow: 4,
        borderRadius: 2,
        overflowY: 'auto',
        p: 1
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" px={1} mb={1}>
        <Typography variant="subtitle1" fontWeight="bold">Thông báo</Typography>
        {received.length > 1 && (
          <Button
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={handleAcceptAll}
            disabled={loading}
          >
            Xác nhận tất cả
          </Button>
        )}
      </Stack>
      <Divider />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <List disablePadding>
          {received.length === 0 && sent.length === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">Không có thông báo</Typography>
            </Box>
          )}

          {received.map((r) => {
            const id = typeof r._id === 'object' ? r._id.toString() : r._id;
            return (
              <ListItem key={id} divider sx={{ bgcolor: '#eaf6ff' }}>
                <ListItemAvatar>
                  <Avatar src={r.avatar} alt={r.name} sx={{ width: 36, height: 36 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="body2" fontWeight={600}>{r.name || 'Người dùng'}</Typography>}
                  secondary="Đã gửi lời mời kết bạn"
                />
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => handleAccept(id)}
                    disabled={!!processing[id]}
                  >
                    {processing[id] === 'accept'
                      ? <CircularProgress size={16} color="success" />
                      : <CheckIcon fontSize="small" />}
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleReject(id)}
                    disabled={!!processing[id]}
                  >
                    {processing[id] === 'reject'
                      ? <CircularProgress size={16} color="error" />
                      : <CloseIcon fontSize="small" />}
                  </IconButton>
                </Stack>
              </ListItem>
            );
          })}
        </List>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NotiDropdown;

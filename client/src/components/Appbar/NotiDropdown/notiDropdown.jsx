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
import DoneIcon from '@mui/icons-material/Done';
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
      return <Avatar sx={{ width: 36, height: 36 }}>N</Avatar>;
  }
};

const NotiDropdown = () => {
  const { firebaseUser } = useAuth();

  // Friend requests states
  const [loading, setLoading] = useState(false);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [processing, setProcessing] = useState({}); // id -> 'accept' | 'reject'

  // Notifications states
  const [notifications, setNotifications] = useState([]);
  const [notiLoading, setNotiLoading] = useState(false);
  const [notiProcessing, setNotiProcessing] = useState({}); // id -> boolean for mark as read

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch friend requests
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

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!firebaseUser) return;
    setNotiLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch('http://localhost:8017/v1/notifications?limit=30', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Không lấy được thông báo');
      }
      const data = await res.json();
      setNotifications(data.notifications || data || []);
    } catch (err) {
      console.error('Lỗi load notifications:', err);
      setSnackbar({ open: true, message: err.message || 'Lỗi tải thông báo', severity: 'error' });
    } finally {
      setNotiLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchRequests();
    fetchNotifications();
  }, [fetchRequests, fetchNotifications]);

  // Friend requests accept/reject handler
  const callFriendAction = async (action, id) => {
    try {
      setProcessing((prev) => ({ ...prev, [id]: action }));
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`http://localhost:8017/v1/friends/${action}/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Lỗi máy chủ');

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

  const handleAccept = (id) => callFriendAction('accept', id);
  const handleReject = (id) => callFriendAction('reject', id);

  const handleAcceptAll = async () => {
    for (const r of received) {
      await callFriendAction('accept', r._id);
    }
  };

  // Mark notification as read handler
  const markNotificationAsRead = async (id) => {
  try {
    setNotiProcessing((prev) => ({ ...prev, [id]: true }));
    const token = await firebaseUser.getIdToken();
    const res = await fetch(`http://localhost:8017/v1/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Lỗi máy chủ');

    // Thay vì chỉ đánh dấu đã đọc, ta lọc bỏ luôn thông báo đã đọc khỏi danh sách
    setNotifications((prev) => prev.filter((n) => n._id !== id));

    setSnackbar({ open: true, message: data.message || 'Đã đánh dấu đã đọc', severity: 'success' });
  } catch (err) {
    console.error('Lỗi đánh dấu thông báo đã đọc:', err);
    setSnackbar({ open: true, message: err.message || 'Lỗi', severity: 'error' });
  } finally {
    setNotiProcessing((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }
};


  return (
    <Box
      sx={{
        width: 360,
        maxHeight: 600,
        bgcolor: '#fff',
        boxShadow: 4,
        borderRadius: 2,
        overflowY: 'auto',
        p: 1
      }}
    >
      {/* Friend Requests Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" px={1} mb={1}>
        <Typography variant="subtitle1" fontWeight="bold">Thông báo kết bạn</Typography>
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
              <Typography variant="body2" color="text.secondary">Không có lời mời kết bạn mới</Typography>
            </Box>
          )}

          {received.map((r) => {
            const id = typeof r._id === 'object' ? r._id.toString() : r._id;
            return (
              <ListItem key={id} divider sx={{ bgcolor: '#eaf6ff' }}>
                <ListItemAvatar>
                  <Avatar
                    src={r.avatar}
                    alt={r.name}
                    sx={{
                      width: 48,
                      height: 48,
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#BC3AAA',
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
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

      {/* Notifications Section */}
      <Box mt={3}>
        <Typography variant="subtitle1" fontWeight="bold" px={1} mb={1}>Thông báo mới</Typography>
        <Divider />

        {notiLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List disablePadding>
            {notifications.length === 0 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">Không có thông báo mới</Typography>
              </Box>
            )}
            {notifications.map((noti) => {
              const id = typeof noti._id === 'object' ? noti._id.toString() : noti._id;
              const isRead = noti.isRead || false;

              // Sử dụng fromUserInfo thay vì fromUserId
              const userInfo = noti.fromUserInfo || {};

              return (
                <ListItem
                  key={id}
                  divider
                  sx={{ bgcolor: isRead ? 'transparent' : '#f0f7ff' }}
                  secondaryAction={
                    !isRead && (
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          markNotificationAsRead(id);
                        }}
                        disabled={!!notiProcessing[id]}
                        title="Đánh dấu đã đọc"
                      >
                        {notiProcessing[id] ? (
                          <CircularProgress size={16} />
                        ) : (
                          <DoneIcon fontSize="small" color="primary" />
                        )}
                      </IconButton>
                    )
                  }
                >
                  <ListItemAvatar>
                    {userInfo.avatar ? (
                      <Avatar
                        src={userInfo.avatar}
                        alt={userInfo.name || 'Người dùng'}
                        sx={{
                          width: 48,
                          height: 48,
                          cursor: 'pointer',
                          border: '2px solid transparent',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#BC3AAA',
                            transform: 'scale(1.1)',
                          },
                        }}
                      />
                    ) : (
                      getIcon(noti.type)
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600}>
                        {noti.message || 'Thông báo'}
                      </Typography>
                    }
                    secondary={new Date(noti.createdAt).toLocaleString()}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      {/* Snackbar */}
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

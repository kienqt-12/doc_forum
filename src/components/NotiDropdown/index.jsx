import React from 'react';
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
  Badge,
} from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const notifications = [
  { id: 1, title: 'Bạn có thông báo mới', time: '2 phút trước', type: 'system', read: false },
  { id: 2, title: 'Ai đó đã thích bài viết của bạn', time: '10 phút trước', type: 'like', read: false },
  { id: 3, title: 'Bình luận mới từ Linh', time: '30 phút trước', type: 'comment', read: true },
  { id: 4, title: 'Tài khoản của bạn đã được cập nhật', time: '1 giờ trước', type: 'system', read: true },
  { id: 5, title: 'Bạn có 5 người theo dõi mới', time: '2 giờ trước', type: 'follow', read: false },
];

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
  return (
    <Box
      sx={{
        width: 340,
        maxHeight: 420,
        bgcolor: '#fff',
        boxShadow: 4,
        borderRadius: 2,
        overflowY: 'auto',
        p: 1,
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ccc',
          borderRadius: 3,
        },
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" px={1} mb={1}>
        <Typography variant="subtitle1" fontWeight="bold">
          Thông báo
        </Typography>
        <IconButton size="small" title="Đánh dấu đã đọc tất cả">
          <DoneAllIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Divider />

      {/* Danh sách thông báo */}
      <List disablePadding>
        {notifications.map((noti) => (
          <ListItem
            key={noti.id}
            divider
            alignItems="flex-start"
            sx={{
              cursor: 'pointer',
              bgcolor: noti.read ? 'transparent' : '#e3f2fd',
              '&:hover': { bgcolor: '#f0f0f0' },
              px: 1.2,
              py: 1,
              gap: 1,
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: '#fff',
                  width: 36,
                  height: 36,
                  border: '1px solid #ccc',
                }}
              >
                {getIcon(noti.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight={noti.read ? 400 : 600}>
                  {noti.title}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {noti.time}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NotiDropdown;

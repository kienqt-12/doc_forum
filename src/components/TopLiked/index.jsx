import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const PRIMARY_COLOR = '#FE5E7E';
const LIGHT_PINK = '#FFF5F8';
const LIGHTER_PINK = '#FFE9EF';

const topPosts = [
  { id: 1, author: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/100?img=1', title: 'Lập trình là đam mê không chỉ là công việc!', likes: 1200 },
  { id: 2, author: 'Trần Thị B', avatar: 'https://i.pravatar.cc/100?img=2', title: 'Tips học React hiệu quả cho người mới bắt đầu', likes: 950 },
  { id: 3, author: 'Lê Minh C', avatar: 'https://i.pravatar.cc/100?img=3', title: 'Cách tối ưu hóa code JavaScript cho hiệu suất cao', likes: 800 },
  { id: 4, author: 'Phạm Thị D', avatar: 'https://i.pravatar.cc/100?img=8', title: 'Hành trình từ zero đến hero trong Python', likes: 1100 },
  { id: 5, author: 'Vũ Văn E', avatar: 'https://i.pravatar.cc/100?img=9', title: 'Tìm hiểu về AI và ứng dụng trong lập trình', likes: 650 },
];

const topDoctors = [
  { id: 1, name: 'BS. Trần Quốc Hưng', avatar: 'https://i.pravatar.cc/100?img=4', specialty: 'Tim mạch', likes: 1020 },
  { id: 2, name: 'BS. Nguyễn Thanh Lan', avatar: 'https://i.pravatar.cc/100?img=5', specialty: 'Nhi khoa', likes: 870 },
  { id: 3, name: 'BS. Đỗ Thị Mai', avatar: 'https://i.pravatar.cc/100?img=10', specialty: 'Nội tiết', likes: 920 },
  { id: 4, name: 'BS. Lê Văn Tâm', avatar: 'https://i.pravatar.cc/100?img=11', specialty: 'Da liễu', likes: 780 },
  { id: 5, name: 'BS. Hoàng Minh Đức', avatar: 'https://i.pravatar.cc/100?img=12', specialty: 'Xương khớp', likes: 1050 },
];

const topUsers = [
  { id: 1, name: 'Phạm Văn Dũng', avatar: 'https://i.pravatar.cc/100?img=6', posts: 55 },
  { id: 2, name: 'Hoàng Thị Hoa', avatar: 'https://i.pravatar.cc/100?img=7', posts: 42 },
  { id: 3, name: 'Nguyễn Thị Linh', avatar: 'https://i.pravatar.cc/100?img=13', posts: 38 },
  { id: 4, name: 'Trần Văn Nam', avatar: 'https://i.pravatar.cc/100?img=14', posts: 60 },
  { id: 5, name: 'Lê Thị Ngọc', avatar: 'https://i.pravatar.cc/100?img=15', posts: 29 },
];

const TopRankedSection = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_, newIndex) => {
    setTabIndex(newIndex);
  };

  const renderList = () => {
    switch (tabIndex) {
      case 0:
        return topPosts.map((post) => (
          <Stack
            key={post.id}
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: LIGHT_PINK,
              '&:hover': {
                bgcolor: LIGHTER_PINK,
              },
              transition: '0.2s ease',
            }}
          >
            <Avatar src={post.avatar} />
            <Box flex={1}>
              <Typography fontWeight={600}>{post.title}</Typography>
              <Typography variant="caption" color="text.secondary">{post.author}</Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <FavoriteIcon sx={{ color: PRIMARY_COLOR, fontSize: 18 }} />
              <Typography variant="body2" fontWeight={500}>
                {post.likes}
              </Typography>
            </Stack>
          </Stack>
        ));

      case 1:
        return topDoctors.map((doctor) => (
          <Stack
            key={doctor.id}
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: LIGHT_PINK,
              '&:hover': {
                bgcolor: LIGHTER_PINK,
              },
              transition: '0.2s ease',
            }}
          >
            <Avatar src={doctor.avatar} />
            <Box flex={1}>
              <Typography fontWeight={600}>{doctor.name}</Typography>
              <Typography variant="caption" color="text.secondary">{doctor.specialty}</Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <EmojiEventsIcon sx={{ color: PRIMARY_COLOR, fontSize: 18 }} />
              <Typography variant="body2" fontWeight={500}>
                {doctor.likes}
              </Typography>
            </Stack>
          </Stack>
        ));

      case 2:
        return topUsers.map((user) => (
          <Stack
            key={user.id}
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: LIGHT_PINK,
              '&:hover': {
                bgcolor: LIGHTER_PINK,
              },
              transition: '0.2s ease',
            }}
          >
            <Avatar src={user.avatar} />
            <Box flex={1}>
              <Typography fontWeight={600}>{user.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user.posts} bài viết</Typography>
            </Box>
            <PeopleAltIcon sx={{ color: PRIMARY_COLOR, fontSize: 20 }} />
          </Stack>
        ));

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 2,
        p: 3,
        mt: 4,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={2} color={PRIMARY_COLOR}>
        🎖️ Bảng xếp hạng nổi bật
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="inherit"
        indicatorColor="primary"
        sx={{
          '& .MuiTab-root': {
            fontWeight: 600,
            color: '#555',
            '&.Mui-selected': {
              color: PRIMARY_COLOR,
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: PRIMARY_COLOR,
          },
        }}
      >
        <Tab icon={<FavoriteIcon />} label="Bài đăng" />
        <Tab icon={<EmojiEventsIcon />} label="Bác sĩ" />
        <Tab icon={<PeopleAltIcon />} label="Người dùng" />
      </Tabs>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        {renderList()}
      </Stack>
    </Box>
  );
};

export default TopRankedSection;

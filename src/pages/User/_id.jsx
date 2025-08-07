import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Container,
  Stack,
  Divider,
  Paper,
  CircularProgress,
  Button
} from '@mui/material';
import { useParams } from 'react-router-dom';
import AppBar from '~/components/Appbar';
import PostList from '~/components/PostsList';

const ProfilePage = () => {
  const { userId } = useParams();
  const token = localStorage.getItem('token');
  const currentUserId = String(localStorage.getItem('userId'));

  const [tab, setTab] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await fetch(`http://localhost:8017/v1/users/${userId}`);
        const userData = await userRes.json();
        setUser(userData.user);
      } catch (err) {
        console.error('❌ Lỗi khi tải dữ liệu người dùng:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleFollow = async () => {
    if (!user || !user._id) return;
    try {
      await fetch(`http://localhost:8017/v1/users/${user._id}/follow`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser((prev) => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1
      }));
    } catch (err) {
      console.error('❌ Follow lỗi:', err);
    }
  };

  const isOwnProfile = user && user._id === currentUserId;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Không tìm thấy người dùng.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar />
      <Box sx={{ position: 'relative', height: 200, backgroundColor: '#FCE4EC' }}>
        <img
          src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80"
          alt="cover"
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            filter: 'brightness(0.85)'
          }}
        />
        <Avatar
          src={user.avatar || 'https://i.pravatar.cc/150?u=default'}
          sx={{
            width: 110,
            height: 110,
            position: 'absolute',
            bottom: -55,
            left: '50%',
            transform: 'translateX(-50%)',
            border: '4px solid #fff',
            boxShadow: 3
          }}
        />
      </Box>

      <Container maxWidth="md" sx={{ mt: 8, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700} color="#BC3AAA">
              {user.name || 'Không rõ tên'}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
              <Typography variant="body2" color="text.secondary">
                👥 {(user.followers || 0).toLocaleString()} người theo dõi
              </Typography>
            </Stack>
            {!isOwnProfile && (
              <Button
                variant="contained"
                size="medium"
                sx={{
                  mt: 2,
                  backgroundColor: user.isFollowing ? '#ccc' : '#FE5E7E',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  px: 3,
                  '&:hover': { backgroundColor: '#e74870' }
                }}
                onClick={handleFollow}
              >
                {user.isFollowing ? '🚫 Huỷ kết bạn' : '🤝 Kết bạn'}
              </Button>
            )}
          </Box>

          <Tabs
            value={tab}
            onChange={(e, newVal) => setTab(newVal)}
            variant="fullWidth"
            textColor="secondary"
            indicatorColor="secondary"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 15,
                color: '#999'
              },
              '& .Mui-selected': {
                color: '#FE5E7E'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FE5E7E'
              },
              mt: 4
            }}
          >
            <Tab label="Bài viết" />
            <Tab label="Giới thiệu" />
          </Tabs>
          <Divider sx={{ mt: -1, opacity: 0.3 }} />

          <Box sx={{ mt: 3 }}>
            {tab === 0 && <PostList userId={user._id} />}
            {tab === 1 && (
              <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: '#fff' }}>
                <Typography variant="body2" color="text.secondary">
                  👤 <strong>Giới thiệu:</strong> Xin chào! Mình là {user.name}, rất vui được kết nối với bạn.
                </Typography>
              </Paper>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;

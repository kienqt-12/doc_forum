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
  Button,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { Mail, MapPin, BookOpen, Calendar, Camera, Pencil } from 'lucide-react';
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
  const [postCount, setPostCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const isOwnProfile = user && user._id === currentUserId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8017/v1/users/${userId}`);
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error('❌ Lỗi khi tải dữ liệu người dùng:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

    useEffect(() => {
    const fetchPostCount = async () => {
      try {
        const res = await fetch(`http://localhost:8017/v1/posts?userId=${userId}`);
        const data = await res.json();
        const postsObj = data.posts;

        if (postsObj && typeof postsObj === 'object') {
          setPostCount(Object.keys(postsObj).length);
        } else {
          setPostCount(0);
        }
      } catch (err) {
        console.error('❌ Lỗi khi đếm bài viết:', err);
        setPostCount(0);
      }
    };

    if (userId) fetchPostCount();
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

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`http://localhost:8017/v1/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bio: user.bio,
          email: user.email,
          address: user.address
        })
      });
      if (!res.ok) throw new Error('Lỗi cập nhật hồ sơ');
      setSnackbar({ open: true, message: '✅ Cập nhật thành công!', severity: 'success' });
      setEditing(false);
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Cập nhật thất bại!', severity: 'error' });
    }
  };

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
    <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh' }}>
      <AppBar />
      <Box sx={{ position: 'relative', height: 200 }}>
        <img
          src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80"
          alt="cover"
          style={{ objectFit: 'cover', width: '100%', height: '100%', filter: 'brightness(0.85)' }}
        />
        <Box sx={{ position: 'absolute', bottom: -55, left: '50%', transform: 'translateX(-50%)' }}>
          <Avatar
            src={user.avatar || 'https://i.pravatar.cc/150?u=default'}
            sx={{ width: 110, height: 110, border: '4px solid #fff', boxShadow: 3 }}
          />
          {isOwnProfile && (
            <Button
              variant="outlined"
              size="small"
              component="label"
              sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, mx: 'auto' }}
            >
              <Camera size={16} /> Đổi ảnh
              <input type="file" hidden accept="image/*" />
            </Button>
          )}
        </Box>
      </Box>

      <Container maxWidth="md" sx={{ mt: 8, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700} color="#BC3AAA">
              {user.name || 'Không rõ tên'}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
              <Typography variant="body2" color="text.secondary">👥 {user.followers || 0} người theo dõi</Typography>
              <Typography variant="body2" color="text.secondary">📝 {postCount} bài viết</Typography>
            </Stack>
            {!isOwnProfile && (
              <Button
                variant="contained"
                size="medium"
                sx={{ mt: 2, backgroundColor: user.isFollowing ? '#ccc' : '#FE5E7E', color: '#fff', fontWeight: 'bold', borderRadius: 3, px: 3 }}
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
            sx={{ mt: 4 }}
          >
            <Tab label="Bài viết" icon={<BookOpen size={18} />} iconPosition="start" />
            <Tab label="Giới thiệu" icon={<Calendar size={18} />} iconPosition="start" />
          </Tabs>
          <Divider sx={{ mt: -1, opacity: 0.3 }} />

          <Box sx={{ mt: 3 }}>
            {tab === 0 && <PostList userId={user._id} />}
            {tab === 1 && (
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Stack spacing={2}>
                  {isOwnProfile && !editing && (
                    <Box textAlign="right">
                      <Button
                        variant="outlined"
                        startIcon={<Pencil size={16} />}
                        onClick={() => setEditing(true)}
                      >
                        Chỉnh sửa thông tin
                      </Button>
                    </Box>
                  )}

                  {isOwnProfile && editing ? (
                    <>
                      <TextField label="Bio" value={user.bio || ''} onChange={(e) => setUser({ ...user, bio: e.target.value })} multiline rows={2} fullWidth />
                      <TextField label="Email" value={user.email || ''} onChange={(e) => setUser({ ...user, email: e.target.value })} fullWidth />
                      <TextField label="Địa chỉ" value={user.address || ''} onChange={(e) => setUser({ ...user, address: e.target.value })} fullWidth />
                      <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="outlined" onClick={() => setEditing(false)}>Huỷ</Button>
                        <Button variant="contained" onClick={handleSaveProfile}>💾 Lưu thay đổi</Button>
                      </Stack>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2"><strong>👤 Giới thiệu:</strong> {user.bio || `Xin chào! Mình là ${user.name}`}</Typography>
                      <Typography variant="body2"><Mail size={16} /> {user.email || 'Chưa cập nhật'}</Typography>
                      <Typography variant="body2"><MapPin size={16} /> {user.address || 'Chưa cập nhật'}</Typography>
                    </>
                  )}

                  <Divider />
                  <Typography variant="body2"><BookOpen size={16} /> {postCount} bài viết</Typography>
                  <Typography variant="body2"><Calendar size={16} /> Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</Typography>
                </Stack>
              </Paper>
            )}
          </Box>
        </Paper>
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;

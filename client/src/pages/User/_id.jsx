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
  Snackbar,
  Alert,
} from '@mui/material';
import { Mail, MapPin, BookOpen, Calendar, Camera, UserCheck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import AppBar from '~/components/Appbar';
import PostList from '~/components/PostsList';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { userId } = useParams();
  const token = localStorage.getItem('accessToken');
  const currentUserId = String(localStorage.getItem('userId'));
  const { user: currentUser, firebaseUser } = useAuth();

  const [tab, setTab] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postCount, setPostCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [friends, setFriends] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(false);

  const isOwnProfile = user && user._id === currentUserId;

  // Lấy thông tin user
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8017/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Không lấy được user');
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
  }, [userId, token]);

  // Lấy số bài viết
  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        const res = await fetch(`http://localhost:8017/v1/posts?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Không lấy được bài viết');
        const data = await res.json();
        const postsObj = data.posts;
        setPostCount(postsObj && typeof postsObj === 'object' ? Object.keys(postsObj).length : 0);
      } catch (err) {
        console.error('❌ Lỗi khi đếm bài viết:', err);
        setPostCount(0);
      }
    };
    if (userId) fetchPostCount();
  }, [userId, token]);

  // Lấy danh sách bạn bè của userId khi chọn tab "Bạn bè"
  useEffect(() => {
    if (tab !== 2) return;

    const fetchFriends = async () => {
      setFriendsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Chưa đăng nhập');

        // Gọi API lấy bạn bè theo userId từ param
        const res = await fetch(`http://localhost:8017/v1/friends/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Không thể tải danh sách bạn bè: ${errText}`);
        }

        const data = await res.json();
        setFriends(data.friends || []);
      } catch (error) {
        console.error('❌ Lỗi tải bạn bè:', error);
        setFriends([]);
      } finally {
        setFriendsLoading(false);
      }
    };

    fetchFriends();
  }, [tab, userId]);

  // Xử lý các hành động liên quan đến bạn bè (kết bạn, hủy, chấp nhận, ...)
  const handleFriendAction = async (type) => {
    if (!user || !firebaseUser) return;
    try {
      const fbToken = await firebaseUser.getIdToken();
      const res = await fetch(`http://localhost:8017/v1/friends/${type}/${userId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${fbToken}`, 'Content-Type': 'application/json' }
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Yêu cầu thất bại');

      // Cập nhật UI nhanh
      if (type === 'request') {
        setUser(prev => ({ ...prev, isRequestSent: true }));
      } else if (type === 'cancel') {
        setUser(prev => ({ ...prev, isRequestSent: false }));
      } else if (type === 'unfriend') {
        setUser(prev => ({ ...prev, isFriend: false }));
      } else if (type === 'accept') {
        setUser(prev => ({ ...prev, isFriend: true, isRequestReceived: false }));
      } else if (type === 'reject') {
        setUser(prev => ({ ...prev, isRequestReceived: false }));
      }

      setSnackbar({
        open: true,
        message: '✅ Thao tác thành công',
        severity: 'success'
      });
    } catch (err) {
      console.error('❌ Lỗi:', err);
      setSnackbar({
        open: true,
        message: err.message || '❌ Thao tác thất bại.',
        severity: 'error'
      });
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
      {/* Cover & avatar */}
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
            <Button variant="outlined" size="small" component="label" sx={{ mt: 1 }}>
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

            {/* Nút bạn bè */}
            {!isOwnProfile && (
              <>
                {user.isFriend && (
                  <Button
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: '#ccc', color: '#fff', fontWeight: 'bold', borderRadius: 3, px: 3 }}
                    onClick={() => handleFriendAction('unfriend')}
                  >
                    🚫 Huỷ kết bạn
                  </Button>
                )}
                {!user.isFriend && !user.isRequestSent && !user.isRequestReceived && (
                  <Button
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: '#FE5E7E', color: '#fff', fontWeight: 'bold', borderRadius: 3, px: 3 }}
                    onClick={() => handleFriendAction('request')}
                  >
                    🤝 Kết bạn
                  </Button>
                )}
                {user.isRequestSent && (
                  <Button
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: '#ccc', color: '#fff', fontWeight: 'bold', borderRadius: 3, px: 3 }}
                    onClick={() => handleFriendAction('cancel')}
                  >
                    📨 Đã gửi lời mời (Huỷ)
                  </Button>
                )}
                {user.isRequestReceived && (
                  <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleFriendAction('accept')}
                    >
                      ✅ Chấp nhận
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleFriendAction('reject')}
                    >
                      ❌ Từ chối
                    </Button>
                  </Stack>
                )}
              </>
            )}
          </Box>

          {/* Tabs */}
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
            <Tab label="Bạn bè" icon={<UserCheck size={18} />} iconPosition="start" />
          </Tabs>
          <Divider sx={{ mt: -1, opacity: 0.3 }} />

          <Box sx={{ mt: 3 }}>
            {tab === 0 && (
              <PostList userId={userId} />
            )}
            {tab === 1 && (
  <Box>
    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#6a1b9a' }}>
      Giới thiệu
    </Typography>
    <Stack spacing={2}>
      <Paper
        elevation={1}
        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: 2, bgcolor: '#f3e5f5' }}
      >
        <Mail size={20} color="#6a1b9a" />
        <Typography variant="body1">{user.email || 'Chưa có'}</Typography>
      </Paper>
      <Paper
        elevation={1}
        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: 2, bgcolor: '#f3e5f5' }}
      >
        <MapPin size={20} color="#6a1b9a" />
        <Typography variant="body1">{user.address || 'Chưa có'}</Typography>
      </Paper>
      <Paper
        elevation={1}
        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: 2, bgcolor: '#f3e5f5' }}
      >
        <Calendar size={20} color="#6a1b9a" />
        <Typography variant="body1">{user.birthday || 'Chưa có'}</Typography>
      </Paper>
    </Stack>
  </Box>
)}

{tab === 2 && (
  <Box>
    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#6a1b9a' }}>
      Danh sách bạn bè
    </Typography>
    {friendsLoading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    ) : friends.length === 0 ? (
      <Typography>Không có bạn bè nào.</Typography>
    ) : (
      <Stack spacing={2}>
        {friends.map(friend => (
          <Paper
            key={friend._id}
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderRadius: 3,
              bgcolor: '#fafafa',
              boxShadow: '0 2px 6px rgba(106, 27, 154, 0.1)',
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: '0 4px 12px rgba(106, 27, 154, 0.2)' },
              cursor: 'pointer'
            }}
          >
            <Avatar
              src={friend.avatar || 'https://i.pravatar.cc/40'}
              sx={{ width: 56, height: 56 }}
              alt={friend.name || 'Bạn bè'}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {friend.name || 'Không rõ tên'}
            </Typography>
          </Paper>
        ))}
      </Stack>
    )}
  </Box>
)}
          </Box>
        </Paper>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;

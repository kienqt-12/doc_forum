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
import { useParams, useNavigate } from 'react-router-dom';
import AppBar from '~/components/Appbar';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // cần có token để xác thực
  const currentUserId = localStorage.getItem('userId'); // lưu từ khi đăng nhập

  const [tab, setTab] = useState(0);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8017/v1/users/${userId}`);
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error('❌ Lỗi khi tải dữ liệu người dùng:', err);
        setUser(null);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await fetch(`http://localhost:8017/v1/posts/user/${userId}`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('❌ Lỗi khi tải bài viết:', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchUserPosts();
  }, [userId]);

  const handleLike = async (postId) => {
    try {
      await fetch(`http://localhost:8017/v1/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likesCount: (p.likesCount || 0) + 1 } : p
        )
      );
    } catch (err) {
      console.error('❌ Lỗi khi like:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Bạn có chắc muốn xoá bài viết này?')) return;
    try {
      await fetch(`http://localhost:8017/v1/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error('❌ Lỗi khi xoá:', err);
    }
  };

  const handleEdit = (post) => {
    navigate(`/posts/edit/${post._id}`);
  };

  const handleFollow = async () => {
    try {
      await fetch(`http://localhost:8017/v1/users/${user._id}/follow`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
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
    <Box sx={{ bgcolor: '#FFF5F7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar />

      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        {/* Thông tin cá nhân */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={user.avatar || 'https://i.pravatar.cc/150?u=default'}
            sx={{ width: 96, height: 96, border: '2px solid #fff', boxShadow: 2 }}
          />
          <Box>
            <Typography variant="h6" fontWeight={700} color="#BC3AAA">
              {user.name || 'Không rõ tên'}
            </Typography>
            <Stack direction="row" spacing={2} mt={0.5}>
              <Typography variant="body2" color="text.secondary">
                📄 {posts.length} bài viết
              </Typography>
              <Typography variant="body2" color="text.secondary">
                👥 {(user.followers || 0).toLocaleString()} theo dõi
              </Typography>
            </Stack>
            {user._id !== currentUserId && (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                sx={{ mt: 1 }}
                onClick={handleFollow}
              >
                {user.isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
              </Button>
            )}
          </Box>
        </Stack>

        {/* Tabs */}
        <Box sx={{ mt: 3 }}>
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
                color: '#FE5E7E'
              },
              '& .Mui-selected': {
                color: '#BC3AAA'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FE5E7E'
              }
            }}
          >
            <Tab label="Bài viết" />
            <Tab label="Giới thiệu" />
          </Tabs>
          <Divider sx={{ mt: -1, opacity: 0.3 }} />
        </Box>

        {/* Nội dung tab */}
        <Box sx={{ mt: 3 }}>
          {tab === 0 && (
            <Stack spacing={2}>
              {posts.map((post) => (
                <Paper
                  key={post._id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    borderLeft: '4px solid #FE5E7E',
                    backgroundColor: '#fff'
                  }}
                >
                  <Typography fontWeight="bold" color="#FE5E7E">
                    {post.title}
                  </Typography>
                  {post.image && (
                    <Box
                      component="img"
                      src={post.image}
                      alt="Ảnh bài viết"
                      sx={{
                        width: '100%',
                        maxHeight: 300,
                        objectFit: 'cover',
                        borderRadius: 1,
                        mt: 1,
                        mb: 1
                      }}
                    />
                  )}
                  <Typography color="text.secondary" fontSize={14}>
                    {post.content || 'Không có nội dung.'}
                  </Typography>

                  <Stack direction="row" spacing={2} mt={1}>
                    <Typography variant="caption" color="text.secondary">
                      💬 {post.commentsCount || 0} bình luận
                    </Typography>
                    <Button size="small" onClick={() => handleLike(post._id)}>
                      ❤️ {post.likesCount || 0}
                    </Button>
                  </Stack>

                  {post.author?._id === currentUserId && (
                    <Stack direction="row" spacing={1} mt={1}>
                      <Button size="small" variant="outlined" onClick={() => handleEdit(post)}>
                        ✏️ Sửa
                      </Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(post._id)}>
                        🗑️ Xoá
                      </Button>
                    </Stack>
                  )}
                </Paper>
              ))}
            </Stack>
          )}

          {tab === 1 && (
            <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: '#fff' }}>
              <Typography variant="body2" color="text.secondary">
                👤 <strong>Giới thiệu:</strong> Xin chào! Mình là {user.name}, rất vui được kết nối với bạn.
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;

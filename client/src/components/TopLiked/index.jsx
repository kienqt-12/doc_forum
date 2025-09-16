import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import axiosClient from '~/api/axiosClient'
import DoctorDialog from '../DoctorPost'
import { useAuth } from '../../context/AuthContext'
import PostDetailModal from '~/components/PostDetail'
import useNavigation from '../../hooks/useNavigation';

const PRIMARY_COLOR = '#FE5E7E'
const LIGHT_PINK = '#FFF5F8'
const LIGHTER_PINK = '#FFE9EF'
const DOCTOR_AVATARS = [
  "https://images.unsplash.com/photo-1606813902779-0c3b1f9d53b1?ixlib=rb-4.0.3&q=80&w=200",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&q=80&w=200",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&q=80&w=200",
  "https://images.unsplash.com/photo-1608889175219-ff2c37b2d30f?ixlib=rb-4.0.3&q=80&w=200",
  "https://images.unsplash.com/photo-1584466977773-270f81e8b8ef?ixlib=rb-4.0.3&q=80&w=200",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&q=80&w=200"
]

const TopRankedSection = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const [data, setData] = useState({ posts: [], doctors: [], users: [] })
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState(null);
  const { user } = useAuth();
  const { goToProfile } = useNavigation();
  // state bác sĩ
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [doctorPosts, setDoctorPosts] = useState([])
  const [loadingDoctorPosts, setLoadingDoctorPosts] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8017/v1/ranking')
        const result = await res.json()
        setData({
          posts: result.posts || [],
          doctors: result.doctors || [],
          users: result.users || []
        })
      } catch (err) {
        console.error('Lỗi khi fetch top rank:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTabChange = (_, newIndex) => {
    setTabIndex(newIndex)
    setSelectedDoctor(null)
    setDoctorPosts([])
  }

  const fetchDoctorPosts = async (doctor) => {
    try {
      setLoadingDoctorPosts(true)
      setSelectedDoctor(doctor)
      setOpenDialog(true)
      const res = await axiosClient.get('http://localhost:8017/v1/doctors/posts', {
        params: { doctorId: doctor._id }
      })
      setDoctorPosts(res.data.posts || [])
    } catch (err) {
      console.error('Lỗi fetch bài viết bác sĩ:', err)
    } finally {
      setLoadingDoctorPosts(false)
    }
  }

  const handleAvatarClick = (event, user) => {
    event.stopPropagation();
    goToProfile(user._id);
  };

  const handleOpenPost = async (post) => {
    try {
      const res = await axiosClient.get(`/posts/${post._id}`);
      setSelectedPost({ ...res.data, currentUserId: user._id });
    } catch (err) {
      console.error("❌ Lỗi khi load chi tiết post:", err);
    }
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === updatedPost._id
          ? {
              ...p,
              ...updatedPost,
              comments: updatedPost.comments?.length || 0,
              likesCount: updatedPost.likes?.length || 0,
              isLiked: updatedPost.likes?.includes(user._id)
            }
          : p
      )
    );

    setSelectedPost((prev) =>
      prev?._id === updatedPost._id
        ? { ...updatedPost, currentUserId: user._id }
        : prev
    );
  };

  const renderList = () => {
    if (loading) return <Typography align="center">Đang tải...</Typography>

    switch (tabIndex) {
      case 0:
        return data.posts
          .filter(p => p.likes !== 0)
          .sort((a, b) => b.likes - a.likes)
          .map(post => (
            <Stack key={post._id} direction="row" alignItems="center" spacing={2} onClick={() => handleOpenPost(post)} sx={{ p:2, borderRadius:2, bgcolor:LIGHT_PINK, '&:hover':{bgcolor:LIGHTER_PINK}, transition:'0.2s ease' }}>
              <Avatar src={post.avatar} />
              <Box flex={1}>
                <Typography fontWeight={600}>{post.title}</Typography>
                <Typography variant="caption" color="text.secondary">{post.author.name || post.author}</Typography>
              </Box>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <FavoriteIcon sx={{ color: PRIMARY_COLOR, fontSize: 18 }} />
                <Typography variant="body2" fontWeight={500}>{post.likes}</Typography>
              </Stack>
            </Stack>
          ))
      case 1:
        return data.doctors
          .filter(d => d.rating !== 0)
          .sort((a,b)=> b.rating - a.rating)
          .map((doctor, idx) => (
            <Stack key={doctor._id} direction="row" alignItems="flex-start" spacing={2} sx={{p:2, borderRadius:2, bgcolor:LIGHT_PINK, '&:hover':{bgcolor:LIGHTER_PINK}, cursor:'pointer'}} onClick={()=>fetchDoctorPosts(doctor)}>
              <Avatar src={doctor.avatar || DOCTOR_AVATARS[idx % DOCTOR_AVATARS.length]} sx={{width:48,height:48}}>
                {!doctor.avatar && doctor.doctor?.charAt(0).toUpperCase()}
              </Avatar>
              <Box flex={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight={600}>{doctor.doctor}</Typography>
                  <Typography variant="body2" fontWeight={600} color={PRIMARY_COLOR}>⭐ {doctor.rating?.toFixed(1) || 0}</Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">{doctor.workplace} – {doctor.city}</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                  {(doctor.tags||[]).slice(0,3).map((tag,i)=><Chip key={i} size="small" label={`#${tag}`} />)}
                  {(doctor.tags?.length||0)>3 && <Chip size="small" label={`+${doctor.tags.length-3}`} />}
                </Stack>
              </Box>
            </Stack>
          ));
      case 2:
        return data.users.filter(u=>u.postCount!==0).map(user=>(
          <Stack key={user._id} direction="row" alignItems="center" spacing={2} onClick={(e) => handleAvatarClick(e, user)} sx={{p:2, borderRadius:2, bgcolor:LIGHT_PINK, '&:hover':{bgcolor:LIGHTER_PINK}}}>
            <Avatar src={user.avatar} />
            <Box flex={1}>
              <Typography fontWeight={600}>{user.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user.postCount} bài viết</Typography>
            </Box>
            <PeopleAltIcon sx={{ color: PRIMARY_COLOR, fontSize: 20 }} />
          </Stack>
        ))
      default: return null
    }
  }

  return (
    <Box sx={{bgcolor:'#fff', borderRadius:2, p:3, mt:4, boxShadow:1}}>
      <Typography variant="h6" fontWeight={700} mb={2} color={PRIMARY_COLOR}>🎖️ Bảng xếp hạng nổi bật</Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" textColor="inherit" indicatorColor="primary" sx={{'& .MuiTab-root':{fontWeight:600, color:'#555', '&.Mui-selected':{color:PRIMARY_COLOR}}, '& .MuiTabs-indicator':{backgroundColor:PRIMARY_COLOR}}}>
        <Tab icon={<FavoriteIcon />} label="Bài đăng" />
        <Tab icon={<EmojiEventsIcon />} label="Bác sĩ" />
        <Tab icon={<PeopleAltIcon />} label="Người dùng" />
      </Tabs>
      <Divider sx={{my:2}} />
      <Stack spacing={2}>{renderList()}</Stack>
      {/* Dialog hiển thị bài viết bác sĩ */}
      {selectedDoctor && (
        <DoctorDialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          doctor={selectedDoctor} 
        />
        )}
      {selectedPost && (
        <PostDetailModal
          open={Boolean(selectedPost)}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
          onUpdatePost={handleUpdatePost}
        />
      )}
    </Box>
  )
}

export default TopRankedSection

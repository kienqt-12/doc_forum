import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Divider
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'

const PRIMARY_COLOR = '#FE5E7E'
const LIGHT_PINK = '#FFF5F8'
const LIGHTER_PINK = '#FFE9EF'

const TopRankedSection = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const [data, setData] = useState({
    posts: [],
    doctors: [],
    users: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8017/v1/ranking') // hoặc URL backend của bạn
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
  }

  const renderList = () => {
    if (loading) {
      return <Typography align='center'>Đang tải...</Typography>
    }

    switch (tabIndex) {
      case 0:
        return data.posts
          .filter(post => post.likes !== 0) // ẩn bài có 0 lượt like
          .map((post) => (
            <Stack
              key={post._id?.toString()}
              direction='row'
              alignItems='center'
              spacing={2}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: LIGHT_PINK,
                '&:hover': { bgcolor: LIGHTER_PINK },
                transition: '0.2s ease'
              }}
            >
              <Avatar src={post.avatar} />
              <Box flex={1}>
                <Typography fontWeight={600}>{post.title}</Typography>
                <Typography variant='caption' color='text.secondary'>
                  {post.author}
                </Typography>
              </Box>
              <Stack direction='row' alignItems='center' spacing={0.5}>
                <FavoriteIcon sx={{ color: PRIMARY_COLOR, fontSize: 18 }} />
                <Typography variant='body2' fontWeight={500}>
                  {post.likes}
                </Typography>
              </Stack>
            </Stack>
          ))

      case 1:
        const doctorAvatars = [
          'https://randomuser.me/api/portraits/men/32.jpg',
          'https://randomuser.me/api/portraits/women/44.jpg',
          'https://randomuser.me/api/portraits/men/53.jpg',
          'https://randomuser.me/api/portraits/women/68.jpg',
          'https://randomuser.me/api/portraits/men/77.jpg'
        ];

        return data.doctors
          .filter(doctor => doctor.rating !== 0) // ẩn bác sĩ rating = 0
          .map((doctor, index) => (
            <Stack
              key={doctor._id?.toString()}
              direction='row'
              alignItems='center'
              spacing={2}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: LIGHT_PINK,
                '&:hover': { bgcolor: LIGHTER_PINK },
                transition: '0.2s ease'
              }}
            >
              <Avatar src={doctorAvatars[index % doctorAvatars.length]} />
              <Box flex={1}>
                <Typography fontWeight={600}>{doctor.name}</Typography>
                <Typography variant='caption' color='text.secondary'>
                  {doctor.specialty}
                </Typography>
              </Box>
              <Stack direction='row' alignItems='center' spacing={0.5}>
                <Typography variant='body2' fontWeight={600} color={PRIMARY_COLOR}>
                  ⭐ {doctor.rating}
                </Typography>
              </Stack>
            </Stack>
          ))

      case 2:
        return data.users
          .filter(user => user.postCount !== 0) // ẩn user có 0 bài viết
          .map((user) => (
            <Stack
              key={user._id?.toString()}
              direction='row'
              alignItems='center'
              spacing={2}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: LIGHT_PINK,
                '&:hover': { bgcolor: LIGHTER_PINK },
                transition: '0.2s ease'
              }}
            >
              <Avatar src={user.avatar} />
              <Box flex={1}>
                <Typography fontWeight={600}>{user.name}</Typography>
                <Typography variant='caption' color='text.secondary'>
                  {user.postCount} bài viết
                </Typography>
              </Box>
              <PeopleAltIcon sx={{ color: PRIMARY_COLOR, fontSize: 20 }} />
            </Stack>
          ))

      default:
        return null
    }
  }

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 2,
        p: 3,
        mt: 4,
        boxShadow: 1
      }}
    >
      <Typography variant='h6' fontWeight={700} mb={2} color={PRIMARY_COLOR}>
        🎖️ Bảng xếp hạng nổi bật
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant='fullWidth'
        textColor='inherit'
        indicatorColor='primary'
        sx={{
          '& .MuiTab-root': {
            fontWeight: 600,
            color: '#555',
            '&.Mui-selected': {
              color: PRIMARY_COLOR
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: PRIMARY_COLOR
          }
        }}
      >
        <Tab icon={<FavoriteIcon />} label='Bài đăng' />
        <Tab icon={<EmojiEventsIcon />} label='Bác sĩ' />
        <Tab icon={<PeopleAltIcon />} label='Người dùng' />
      </Tabs>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>{renderList()}</Stack>
    </Box>
  )
}

export default TopRankedSection

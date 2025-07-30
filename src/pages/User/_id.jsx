import React, { useState } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Container,
  Stack,
  Divider,
  Paper
} from '@mui/material'
import AppBar from '~/components/AppBar'

const ProfilePage = () => {
  const [tab, setTab] = useState(0)

  return (
    <Box sx={{ bgcolor: '#FFF5F7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Thông tin cá nhân */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src="https://via.placeholder.com/96"
            sx={{
              width: 96,
              height: 96,
              border: '2px solid #fff'
            }}
          />
          <Box>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              Nguyễn Văn A
            </Typography>
            <Stack direction="row" spacing={2} mt={0.5}>
              <Typography variant="body2" color="text.secondary">📄 12 bài viết</Typography>
              <Typography variant="body2" color="text.secondary">👥 1.5k theo dõi</Typography>
            </Stack>
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
            <Tab label="Bạn bè" />
          </Tabs>
          <Divider sx={{ mt: -1, opacity: 0.3 }} />
        </Box>

        {/* Nội dung */}
        <Box sx={{ mt: 3 }}>
          {tab === 0 && (
            <Stack spacing={2}>
              {[1, 2, 3].map((i) => (
                <Paper
                  key={i}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    borderLeft: '4px solid #FE5E7E',
                    backgroundColor: '#fff'
                  }}
                >
                  <Typography fontWeight="bold" color="#FE5E7E">
                    Nguyễn Văn A
                  </Typography>
                  <Typography color="text.secondary" fontSize={14}>
                    Đây là bài viết số {i}.
                  </Typography>
                </Paper>
              ))}
            </Stack>
          )}

          {tab === 1 && (
            <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: '#fff' }}>
              <Typography variant="body2" color="text.secondary">
                Thông tin cá nhân đang cập nhật...
              </Typography>
            </Paper>
          )}

          {tab === 2 && (
            <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: '#fff' }}>
              <Typography variant="body2" color="text.secondary">
                Danh sách bạn bè đang cập nhật...
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default ProfilePage

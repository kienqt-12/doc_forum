import Container from "@mui/material/Container"
import Box from '@mui/material/Box'
import AppBar from '~/components/AppBar'
import AppFilter from "~/components/AppFilter"
import PostList from "../../components/PostsList"
import AutoSlider from "~/components/AutoSlider"
import TopRankedSection from "~/components/TopLiked"
import React, { useState, useEffect, useRef } from 'react';

function Board() {
  const [filters, setFilters] = useState(null);
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Thanh AppBar trên cùng */}
      <AppBar />

      {/* Nội dung dưới AppBar */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          px: 5,
          py: 2,
          bgcolor: (theme) => theme.appCustom.boardBar.backgroundColor,
          gap: 2,
          overflow: 'hidden'
        }}
      >
        {/* Cột bên trái: AppFilter + PostList */}
        <Box
          sx={{
            flex: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          {/* AppFilter không cuộn */}
          <Box sx={{ mb: 1, flexShrink: 0 }}>
            <AppFilter onSearch={setFilters} />  {/* ✅ nhận dữ liệu filter */}
          </Box>

          {/* Cuộn bài viết */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            <PostList filters={filters} />       {/* ✅ truyền filter xuống */}
          </Box>
        </Box>

        {/* Cột bên phải: AutoSlider + TopLikedPosts */}
        <Box
          sx={{
            flex: 1,
            minWidth: '250px',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            height: '100%'
          }}
        >
          {/* AutoSlider không cuộn */}
          <Box sx={{ mb: 1, flexShrink: 0 }}>
            <AutoSlider />
          </Box>

          {/* Cuộn bài TopLiked */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            <TopRankedSection />
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Board

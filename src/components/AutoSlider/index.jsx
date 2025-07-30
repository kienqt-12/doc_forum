import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Fade } from '@mui/material';

const slides = [
  {
    title: 'Chào mừng đến với trang cá nhân!',
    image: 'https://via.placeholder.com/800x300/FE5E7E/ffffff?text=Quảng+Cáo+1',
  },
  {
    title: 'Khám phá những bài viết mới nhất',
    image: 'https://via.placeholder.com/800x300/BC3AAA/ffffff?text=Quảng+Cáo+2',
  },
  {
    title: 'Kết nối với bạn bè dễ dàng!',
    image: 'https://via.placeholder.com/800x300/FFB6C1/000000?text=Quảng+Cáo+3',
  },
];

const AutoSlider = () => {
  const [index, setIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
        setFadeIn(true);
      }, 300);
    }, 10000); // 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', my: 2 }}>
      <Fade in={fadeIn} timeout={500}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            height: 200,
            overflow: 'hidden',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            component="img"
            src={slides[index].image}
            alt={slides[index].title}
            sx={{
              width: '100%',
              height: '70%',
              objectFit: 'cover',
              display: 'block',
              flexShrink: 0
            }}
          />
          <Box
            sx={{
              height: '30%',
              px: 2,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6" fontWeight={600} color="#FE5E7E" align="center" noWrap>
              {slides[index].title}
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default AutoSlider;

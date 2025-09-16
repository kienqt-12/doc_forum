import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Fade } from '@mui/material';

import Ads1 from '~/assets/1.jpg';
import Ads2 from '~/assets/2.jpg';
import Ads3 from '~/assets/3.jpg';

const slides = [
  {
    image: Ads1
  },
  {
    image: Ads2
  },
  {
    image: Ads3
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
              width: '95%',
              height: '100%',
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

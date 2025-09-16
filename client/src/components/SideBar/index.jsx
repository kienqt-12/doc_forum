import React from 'react';
import { Card, CardContent, Stack, Typography, Avatar, Button, Divider } from '@mui/material';
import { Person, Article, Login } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import useNavigation from "../../hooks/useNavigation";


function Sidebar() {
  const { user } = useAuth();
  const postCount = 5; // Giả lập số bài đăng
  const { goToProfile } = useNavigation();
  return (
    <Card
      sx={{
        position: 'sticky',
        top: 16,
        bgcolor: 'white',
        background: 'linear-gradient(to bottom, white, #FFF5F7)',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderImage: 'linear-gradient(to right, #FE5E7E, #BC3AAA) 1',
        p: 2,
        minWidth: '250px',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
      }}
      className="transition-all duration-300"
    >
      <CardContent sx={{ p: 0 }}>
        {user ? (
          <Stack direction="column" spacing={1.5} alignItems="center">
            <Avatar
              alt={user.name}
              src={user.avatar}
              sx={{
                width: 60,
                height: 60,
                borderImage: 'linear-gradient(to right, #FE5E7E, #BC3AAA) 1',
                borderRadius: '50%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                transition: 'filter 0.3s',
                '&:hover': { filter: 'brightness(1.1)' },
              }}
            />
            <Stack direction="column" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Person sx={{ fontSize: '18px', color: '#FE5E7E' }} />
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: '600', color: '#FE5E7E' }}>
                  {user.name}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Article sx={{ fontSize: '18px', color: '#BC3AAA' }} />
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: '500', color: '#BC3AAA' }}>
                  {postCount} bài đăng
                </Typography>
              </Stack>
            </Stack>
            <Divider sx={{ my: 1, borderColor: '#FE5E7E', opacity: 0.5 }} />
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: '600',
                color: '#FFF',
                background: 'linear-gradient(to right, #FE5E7E, #BC3AAA)',
                transition: 'transform 0.2s, filter 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  filter: 'brightness(1.1)',
                  background: 'linear-gradient(to right, #FE5E7E, #BC3AAA)',
                },
              }}
              onClick={goToProfile}
            >
              Xem trang cá nhân
            </Button>
          </Stack>
        ) : (
          <Stack direction="column" alignItems="center" spacing={1}>
            <Login sx={{ fontSize: '24px', color: '#FE5E7E' }} />
            <Typography
              variant="body1"
              sx={{ fontSize: '0.85rem', fontWeight: '500', color: '#FE5E7E', textAlign: 'center' }}
            >
              Vui lòng đăng nhập để xem profile
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default Sidebar;
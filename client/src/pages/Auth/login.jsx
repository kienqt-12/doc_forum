import {
  Box, Paper, TextField, Button, Typography, Avatar,
  IconButton, Stack
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import useNavigation from '../../hooks/useNavigation';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

function Login() {
  const { user, login } = useAuth();
  const { goHome } = useNavigation();

  useEffect(() => {
    if (user) goHome();
  }, [user]);

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(to right, #667eea, #764ba2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 380,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <LockOutlinedIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" fontWeight="bold">
          Đăng nhập
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={1}>
          Đăng nhập nhanh với Google
        </Typography>

        <Stack direction="row" spacing={2}>
          <IconButton
            sx={{
              backgroundColor: '#ffffff',
              '&:hover': { backgroundColor: '#eeeeee' },
              border: '1px solid #ddd',
            }}
            onClick={login}
          >
            <GoogleIcon color="error" />
          </IconButton>
        </Stack>

        <Typography variant="body2" mt={2} color="text.secondary">
          Chưa có tài khoản? <a href="#">Đăng ký</a>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;

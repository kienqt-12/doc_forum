import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Button,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  MedicalServices,
  LocationOn,
  Sort,
  Search,
  Add,
} from '@mui/icons-material';
import CreatePostModel from '~/components/CreatePostModel';
import { useAuth } from '../../context/AuthContext';
import useNavigation from '../../hooks/useNavigation';

const specialties = ['Tất cả', 'Nhi khoa', 'Tim mạch', 'Da liễu', 'Nội tổng quát'];
const cities = ['Tất cả', 'Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ'];
const sortOptions = ['Mới nhất', 'Cũ nhất'];

function AppFilter() {
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('Mới nhất');
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { user } = useAuth();
  const { goToLogin } = useNavigation();

  const handleCreatePost = (formData) => {
    console.log('📨 Dữ liệu bài viết:', formData);
    setOpen(false);
  };

  const handleSearch = () => {
    console.log({ specialty, city, sort });
  };

  const handleCreateClick = () => {
    if (!user) {
      setShowAlert(true);
      setTimeout(() => {
        goToLogin(); // ✅ Chuyển hướng sau cảnh báo
      }, 1500);
    } else {
      setOpen(true);
    }
  };

  const selectStyle = {
    minWidth: 160,
    '& label': {
      color: '#FE5E7E',
    },
    '& label.Mui-focused': {
      color: '#FE5E7E',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '& fieldset': {
        borderColor: '#E0E0E0',
      },
      '&:hover fieldset': {
        borderColor: '#FE5E7E',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FE5E7E',
      },
    },
    '& .MuiSvgIcon-root': {
      color: '#FE5E7E',
    },
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        mx: 'auto',
        mt: 2,
        px: 2,
        py: 1,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FormControl size="small" sx={selectStyle}>
        <InputLabel>Chuyên khoa</InputLabel>
        <Select
          value={specialty}
          label="Chuyên khoa"
          onChange={(e) => setSpecialty(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <MedicalServices sx={{ fontSize: 18, color: '#FE5E7E' }} />
            </InputAdornment>
          }
        >
          {specialties.map((s, i) => (
            <MenuItem key={i} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={selectStyle}>
        <InputLabel>Tỉnh/Thành</InputLabel>
        <Select
          value={city}
          label="Tỉnh/Thành"
          onChange={(e) => setCity(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <LocationOn sx={{ fontSize: 18, color: '#FE5E7E' }} />
            </InputAdornment>
          }
        >
          {cities.map((c, i) => (
            <MenuItem key={i} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={selectStyle}>
        <InputLabel>Sắp xếp</InputLabel>
        <Select
          value={sort}
          label="Sắp xếp"
          onChange={(e) => setSort(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <Sort sx={{ fontSize: 18, color: '#FE5E7E' }} />
            </InputAdornment>
          }
        >
          {sortOptions.map((s, i) => (
            <MenuItem key={i} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          size="small"
          onClick={handleSearch}
          startIcon={<Search />}
          sx={{
            textTransform: 'none',
            background: '#FE5E7E',
            '&:hover': { background: '#E24C6A' },
            px: 2,
            borderRadius: 2,
          }}
        >
          Lọc
        </Button>
        <Button
          variant="outlined"
          onClick={handleCreateClick}
          size="small"
          startIcon={<Add />}
          sx={{
            textTransform: 'none',
            color: '#FE5E7E',
            borderColor: '#FE5E7E',
            '&:hover': {
              borderColor: '#E24C6A',
              background: '#FFF0F3',
            },
            px: 2,
            borderRadius: 2,
          }}
        >
          Tạo bài
        </Button>
      </Stack>

      <CreatePostModel
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* ✅ Snackbar warning */}
      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowAlert(false)} severity="warning" sx={{ width: '100%' }}>
          Bạn cần đăng nhập để đăng bài viết!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AppFilter;

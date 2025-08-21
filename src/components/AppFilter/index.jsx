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
  Chip,
  OutlinedInput,
} from '@mui/material';
import {
  MedicalServices,
  LocationOn,
  Sort,
  Search,
  Add, LocalHospital
} from '@mui/icons-material';
import CreatePostModel from '~/components/CreatePostModel';
import { useAuth } from '../../context/AuthContext';
import useNavigation from '../../hooks/useNavigation';

const specialties = ['Tất cả', 'Tim mạch',
  "Nội tiết",
  "Da liễu",
  "Nhi khoa",
  "Sản phụ khoa",
  "Ngoại tổng quát",
  "Tai mũi họng",
  "Răng hàm mặt",
  "Mắt",
  "Tâm thần"];
const cities = ['Tất cả', 'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'Bình Dương', 'Đồng Nai', 'Nghệ An', 'Thanh Hóa', 'Thừa Thiên Huế'];
const sortOptions = ['Mới nhất', 'Cũ nhất'];
const WORKPLACES_BY_CITY = {
  "Hà Nội": [
    "Bệnh viện Bạch Mai",
    "Bệnh viện Hữu nghị Việt Đức",
    "Bệnh viện K",
    "Bệnh viện Phụ sản Trung ương",
    "Bệnh viện Quân y 108",
    "Bệnh viện Đại học Y Hà Nội",
    "Bệnh viện E Trung ương"
  ],
  "TP. Hồ Chí Minh": [
    "Bệnh viện Chợ Rẫy",
    "Bệnh viện Nhi Đồng 1",
    "Bệnh viện Nhi Đồng 2",
    "Bệnh viện Từ Dũ",
    "Bệnh viện Nhân dân Gia Định",
    "Bệnh viện 115"
  ],
  "Đà Nẵng": [
    "Bệnh viện Đà Nẵng",
    "Bệnh viện C Đà Nẵng",
    "Bệnh viện Phụ sản - Nhi Đà Nẵng"
  ],
  "Hải Phòng": [
    "Bệnh viện Hữu nghị Việt Tiệp",
    "Bệnh viện Trẻ em Hải Phòng",
    "Bệnh viện Phụ sản Hải Phòng"
  ],
  "Cần Thơ": [
    "Bệnh viện Đa khoa Trung ương Cần Thơ",
    "Bệnh viện Nhi đồng Cần Thơ",
    "Bệnh viện Phụ sản Cần Thơ"
  ],
  "Bình Dương": [
    "Bệnh viện Đa khoa tỉnh Bình Dương",
    "Bệnh viện Quốc tế Becamex",
    "Bệnh viện Hoàn Hảo"
  ],
  "Đồng Nai": [
    "Bệnh viện Đa khoa Đồng Nai",
    "Bệnh viện Nhi Đồng Nai",
    "Bệnh viện Thống Nhất Đồng Nai"
  ],
  "Nghệ An": [
    "Bệnh viện Hữu nghị Đa khoa Nghệ An",
    "Bệnh viện Sản Nhi Nghệ An",
    "Bệnh viện 115 Nghệ An"
  ],
  "Thanh Hóa": [
    "Bệnh viện Đa khoa tỉnh Thanh Hóa",
    "Bệnh viện Nhi Thanh Hóa",
    "Bệnh viện Phụ sản Thanh Hóa"
  ],
  "Thừa Thiên Huế": [
    "Bệnh viện Trung ương Huế",
    "Bệnh viện Trường Đại học Y Dược Huế",
    "Bệnh viện Quốc tế Huế"
  ]
};

function AppFilter({ onSearch }) {
  const [workplace, setWorkplace] = useState('');
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
    const filters = {
      city,
      sort,
    };

    // ✅ chuyên khoa
    if (specialty && specialty !== "Tất cả") {
      filters.tags = [specialty];
    } else {
      filters.tags = [];
    }

    // ✅ nơi làm việc
    if (workplace && workplace !== "Tất cả") {
      filters.workplace = workplace;
    }

    console.log(filters);

    if (typeof onSearch === 'function') {
      onSearch(filters);
    }
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
          value={specialty || ''}
          onChange={(e) => setSpecialty(e.target.value)}
          input={<OutlinedInput label="Chuyên khoa" />}
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
        <InputLabel>Nơi làm việc</InputLabel>
        <Select
          value={workplace}
          label="Nơi làm việc"
          onChange={(e) => setWorkplace(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <LocalHospital sx={{ fontSize: 18, color: '#FE5E7E' }} />
            </InputAdornment>
          }
        >
          <MenuItem value="Tất cả">Tất cả</MenuItem>
          {city && city !== "Tất cả" && WORKPLACES_BY_CITY[city]?.map((w, i) => (
            <MenuItem key={i} value={w}>
              {w}
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

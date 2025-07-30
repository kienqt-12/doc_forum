import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Rating,
  Chip,
  Box,
  Stack,
  Divider,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import WorkIcon from '@mui/icons-material/Work';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const PostDetailCard = ({
  post = {
    title: 'Khám da liễu tại BV Da Liễu Trung Ương',
    content:
      'Tôi đã khám da liễu tại đây và rất hài lòng với dịch vụ. Bác sĩ nhiệt tình, chu đáo và giải thích rõ ràng tình trạng bệnh.',
    doctor: 'BS. Nguyễn Thị Mai',
    workplace: 'BV Da Liễu Trung Ương',
    city: 'Hà Nội',
    rating: 4.5,
    avatar: '',
    hashtags: ['Da liễu', 'Chăm sóc da'],
    createdAt: '2025-07-30',
  },
}) => {
  return (
    <Card
      elevation={3}
      sx={{
        maxWidth: 720,
        margin: 'auto',
        mt: 3,
        borderRadius: 3,
        px: 2,
        py: 2,
        background: '#fff',
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: '#FE5E7E' }} src={post.avatar}>
            {post.doctor?.[0] || <LocalHospitalIcon />}
          </Avatar>
        }
        title={
          <Typography fontWeight="bold" fontSize="1.1rem">
            {post.doctor}
          </Typography>
        }
        subheader={
          <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
            <WorkIcon sx={{ fontSize: 16, color: '#888' }} />
            <Typography variant="body2" color="text.secondary">
              {post.workplace}
            </Typography>
            <LocationOn sx={{ fontSize: 16, color: '#888', ml: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {post.city}
            </Typography>
          </Stack>
        }
      />

      <CardContent sx={{ pt: 0 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom color="#FE5E7E">
          {post.title}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {post.content}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" fontWeight={500}>
            Đánh giá:
          </Typography>
          <Rating value={post.rating} precision={0.5} readOnly sx={{ color: '#FFD700' }} />
        </Stack>

        {post.hashtags && post.hashtags.length > 0 && (
          <Box mt={2}>
            {post.hashtags.map((tag, i) => (
              <Chip
                key={i}
                label={`#${tag}`}
                variant="outlined"
                size="small"
                sx={{
                  mr: 1,
                  color: '#FE5E7E',
                  borderColor: '#FE5E7E',
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" display="block" mt={3}>
          Ngày đăng: {post.createdAt}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostDetailCard;

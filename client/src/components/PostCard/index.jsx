// components/PostCard.jsx
import React from 'react'
import {
  Box, Card, CardContent, Typography, Avatar,
  IconButton, Rating, Divider, Stack, TextField, Button
} from '@mui/material'
import {
  Favorite, FavoriteBorder, Share, Comment, Visibility
} from '@mui/icons-material'

function PostCard({
  post,
  onClick,
  onAvatarClick,
  onLike,
  onCommentClick,
  onCommentSubmit,
  showCommentForm,
  commentText,
  setCommentText,
  commentFormRef
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        bgcolor: '#fff',
        border: '1px solid #BC3AAA',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-4px)'
        },
        overflow: 'hidden'
      }}
    >
      {post.imageUrl && (
        <Box sx={{ width: 160, height: 180, borderRight: '2px solid #BC3AAA' }}>
          <img src={post.imageUrl} alt="Ảnh bài viết" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
      )}

      <Box sx={{ display: 'flex', flex: 1, paddingLeft: '40px' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={post.image}
            alt={post.author?.name || 'Author'}
            sx={{
              width: 60,
              height: 60,
              cursor: 'pointer',
              border: '2px solid transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#BC3AAA',
                transform: 'scale(1.1)'
              }
            }}
            onClick={onAvatarClick}
          />
        </Box>

        <CardContent sx={{ flex: 1, p: 2, pt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                {post.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {post.hoursAgo}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Rating value={post.rating} readOnly precision={0.5} sx={{ fontSize: '1.1rem', color: '#FFD700' }} />
              <IconButton size="small" sx={{ '&:hover': { color: '#BC3AAA' } }}>
                <Share sx={{ fontSize: 20, color: '#FE5E7E' }} />
              </IconButton>
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 4, color: '#666', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={onLike} sx={{ '&:hover': { color: '#BC3AAA' } }}>
                {post.isLiked ? (
                  <Favorite sx={{ fontSize: 20, color: '#BC3AAA' }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: 20, color: '#FE5E7E' }} />
                )}
              </IconButton>
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                {post.likesCount} lượt thích
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={onCommentClick} sx={{ '&:hover': { color: '#BC3AAA' } }}>
                <Comment sx={{ fontSize: 18, color: '#FE5E7E' }} />
              </IconButton>
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                {post.comments} bình luận
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Visibility sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                {post.views} lượt xem
              </Typography>
            </Box>
          </Box>

          {showCommentForm && (
            <Box
              ref={commentFormRef}
              sx={{
                mt: 2,
                bgcolor: '#fff',
                borderRadius: '8px',
                p: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': { borderColor: '#BC3AAA' },
                    '&:hover fieldset': { borderColor: '#BC3AAA' },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={onCommentSubmit}
                disabled={!commentText?.trim()}
                sx={{
                  bgcolor: '#BC3AAA',
                  color: '#fff',
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#a2308f' },
                }}
              >
                Gửi bình luận
              </Button>
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  )
}

export default PostCard

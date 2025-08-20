import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Stack,
  CircularProgress,
  Rating,Chip
} from "@mui/material";
import {Business, FavoriteBorder, Comment, Visibility, MoreVert,
  Person,PersonOutline,
  LocalHospital,Favorite,
  LocationOn, } from "@mui/icons-material";
import axiosClient from "../../api/axiosClient";
import PostDetailModal from "../PostDetail";

const LIGHT_PINK = "#FFF5F8";
const LIGHTER_PINK = "#FFE9EF";

function DoctorDialog({ open, onClose, doctor }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchDoctorPosts = async () => {
      if (!doctor) return;
      setLoading(true);
      try {
        const res = await axiosClient.get("/doctors/posts", {
          params: { doctorId: doctor._id },
        });
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("❌ Lỗi fetch bài viết bác sĩ:", err);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchDoctorPosts();
  }, [open, doctor]);

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === updatedPost._id
          ? {
              ...p,
              ...updatedPost,
              comments: updatedPost.comments?.length || 0,
              likesCount: updatedPost.likes?.length || 0,
              isLiked: updatedPost.likes?.includes(user._id)
            }
          : p
      )
    );

    setSelectedPost((prev) =>
      prev?._id === updatedPost._id
        ? { ...updatedPost, currentUserId: user._id }
        : prev
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* Title sticky chứa Card thông tin bác sĩ */}
      <DialogTitle
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "#fff",
          zIndex: 10,
          borderBottom: "1px solid #eee",
          p: 2,
        }}
      >
        {doctor && (
          <Card
            sx={{
              display: "flex",
              p: 2,
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <Avatar src={doctor.avatar} sx={{ width: 80, height: 80, mr: 2 }} />
            <Box flex={1}>
              <Typography variant="h6" fontWeight={600}>
                {doctor.doctor}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                <Business sx={{ fontSize: 18, color: "#8E24AA" }} />
                <Typography variant="body2" color="text.secondary">
                  {doctor.workplace}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                <LocationOn sx={{ fontSize: 18, color: "#8E24AA" }} />
                <Typography variant="body2" color="text.secondary">
                  {doctor.city}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                <LocalHospital sx={{ color: "#BC3AAA" }} />
                <Rating
                  value={doctor.rating}
                  readOnly
                  precision={0.5}
                  sx={{ fontSize: "1.1rem" }}
                />
              </Stack>
            </Box>
          </Card>
        )}
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "60vh", overflowY: "auto" }}>
  {loading ? (
    <Box display="flex" justifyContent="center" py={3}>
      <CircularProgress />
    </Box>
  ) : posts.length === 0 ? (
    <Typography>Chưa có bài viết nào.</Typography>
  ) : (
    <Stack spacing={2}>
      {posts.map((post) => (
        <Box
          key={post._id}
          sx={{
            display: "flex",
            flexDirection: "row",
            p: 2,
            borderRadius: 2,
            bgcolor: "#FFF5F8",
            "&:hover": {
              bgcolor: "#FFE9EF",
              boxShadow: 3,
              cursor: "pointer",
              transform: "translateY(-2px)",
            },
            transition: "0.2s ease",
            gap: 2,
          }}
          onClick={() => setSelectedPost(post)}
        >
          {/* Ảnh bài viết */}
          {post.imageUrl && (
            <Box sx={{ width: 100, height: 100, flexShrink: 0 }}>
              <img
                src={post.imageUrl}
                alt="Ảnh bài viết"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
              />
            </Box>
          )}

          {/* Nội dung bài viết */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography fontWeight={600} fontSize="1rem">
              {post.title}
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                src={post.author?.avatarUrl || ""}
                sx={{ width: 24, height: 24 }}
              >
                {post.author?.name?.[0] || "U"}
              </Avatar>
              <Typography variant="body2" color="text.primary">
                {post.author?.name || "Unknown"}
              </Typography>
              {post.author?.role === "doctor" && (
                <Box
                  sx={{
                    ml: 1,
                    px: 1,
                    py: 0.3,
                    bgcolor: "#E0F7FA",
                    color: "#00796B",
                    borderRadius: 1,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                  }}
                >
                  Bác sĩ
                </Box>
              )}
            </Box>

            {post.createdAt && (
              <Typography variant="caption" color="text.secondary">
                {new Date(post.createdAt).toLocaleString()}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Stack>
  )}

  {/* Modal chi tiết bài viết */}
  {selectedPost && (
    <PostDetailModal
      open={Boolean(selectedPost)}
      onClose={() => setSelectedPost(null)}
      post={selectedPost}
      onUpdatePost={handleUpdatePost}
    />
  )}
</DialogContent>



      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DoctorDialog;

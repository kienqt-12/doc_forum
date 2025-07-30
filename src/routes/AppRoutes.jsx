// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Dashboard from "../pages/Dashboard"
import { useAuth } from "../contexts/AuthContext"
import CreatePostModal from "../components/CreatePostModel"
import UserProfile from "../pages/User"
import Posted from "../pages/Posted"

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/create-post"
        element={user ? <CreatePostModal /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/profile"
        element={user ? <UserProfile/> : <Navigate to="/login" replace />}
      />
      <Route
        path="/postdetail"
        element={user ? <Posted/> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


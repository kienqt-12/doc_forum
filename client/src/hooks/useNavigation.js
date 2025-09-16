import { useNavigate } from "react-router-dom";

export default function useNavigation() {
  const navigate = useNavigate();

  return {
    goToPostDetail: () => navigate("/postdetail"),
    goToDashboard: () => navigate("/dashboard"),
    goToLogin: () => navigate("/login"),
    goHome: () => navigate("/"),
    goToProfile: (userId) => navigate(`/profile/${userId}`)
  };
}

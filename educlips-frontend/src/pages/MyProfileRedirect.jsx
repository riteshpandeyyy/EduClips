import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function MyProfileRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/users/creator/profile");
        navigate(`/creator/${res.data.id}`);
      } catch (err) {
        console.error("Profile check error:", err);
        navigate("/create-profile");
      }
    };

    fetchProfile();
  }, [navigate]);

  return null;
}

export default MyProfileRedirect;
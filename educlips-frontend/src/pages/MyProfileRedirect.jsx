import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const MyProfileRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/users/creator/profile");
        navigate(`/creator/${res.data.id}`);
      } catch (err) {
        navigate("/create-profile");
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={loaderStyle}></div>
        <p style={textStyle}>
          Loading your profile...
        </p>
      </div>
    </div>
  );
};

/* ---------- RESPONSIVE STYLES ---------- */

const containerStyle = {
  background: "#0f0f0f",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px 16px",
  boxSizing: "border-box",
};

const cardStyle = {
  background: "#1c1c1c",
  padding: "clamp(24px, 6vw, 40px)",
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  width: "100%",
  maxWidth: "400px",
  boxSizing: "border-box",
};

const loaderStyle = {
  width: "clamp(36px, 8vw, 48px)",
  height: "clamp(36px, 8vw, 48px)",
  border: "4px solid #333",
  borderTop: "4px solid #ff2e63",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto",
};

const textStyle = {
  marginTop: "18px",
  color: "#aaa",
  fontSize: "clamp(14px, 3.5vw, 16px)",
};

export default MyProfileRedirect;
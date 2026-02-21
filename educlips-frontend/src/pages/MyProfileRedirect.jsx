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
        <p style={{ marginTop: "15px", color: "#aaa" }}>
          Loading your profile...
        </p>
      </div>
    </div>
  );
};

/* Styles */

const containerStyle = {
  background: "#0f0f0f",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardStyle = {
  background: "#1c1c1c",
  padding: "40px",
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
};

const loaderStyle = {
  width: "40px",
  height: "40px",
  border: "4px solid #333",
  borderTop: "4px solid #ff2e63",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

export default MyProfileRedirect;
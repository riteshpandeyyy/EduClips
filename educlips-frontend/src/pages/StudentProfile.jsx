import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

function StudentProfile() {
  const [user, setUser] = useState(null);
  const [likedVideos, setLikedVideos] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const userRes = await axios.get("/users/me");
      const likedRes = await axios.get("/users/me/liked-videos");
      const followingRes = await axios.get("/users/me/following");

      setUser(userRes.data);
      setLikedVideos(likedRes.data);
      setFollowing(followingRes.data);

    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (creatorId) => {
    try {
      await axios.post(`/users/creators/${creatorId}/unfollow`);

      setFollowing((prev) =>
        prev.filter((creator) => creator.id !== creatorId)
      );

    } catch (err) {
      console.error("Unfollow error:", err);
    }
  };

  if (loading)
    return (
      <div style={pageStyle}>
        <p style={{ color: "white" }}>Loading...</p>
      </div>
    );

  if (!user)
    return (
      <div style={pageStyle}>
        <p style={{ color: "white" }}>User not found</p>
      </div>
    );

  return (
    <div style={pageStyle}>
      <div style={{ width: "100%", maxWidth: "800px" }}>

        {/* PROFILE HEADER */}
        <div style={profileCard}>
          <h2 style={{ fontSize: "clamp(20px, 5vw, 28px)" }}>
            {user.name}
          </h2>
          <p style={{ color: "#aaa", marginTop: "6px" }}>
            {user.email}
          </p>
        </div>

        {/* FOLLOWING SECTION */}
        <h3 style={sectionTitle}>Following Creators</h3>

        {following.length === 0 ? (
          <p style={emptyText}>
            You are not following anyone yet.
          </p>
        ) : (
          following.map((creator) => (
            <div key={creator.id} style={cardStyle}>
              <div>
                <h4>{creator.name}</h4>
                <p style={{ color: "#bbb" }}>
                  {creator.bio}
                </p>
              </div>

              <div style={buttonRow}>
                <Link to={`/creator/${creator.id}`}>
                  <button style={primaryButton}>
                    View Profile
                  </button>
                </Link>

                <button
                  style={dangerButton}
                  onClick={() =>
                    handleUnfollow(creator.id)
                  }
                >
                  Unfollow
                </button>
              </div>
            </div>
          ))
        )}

        {/* LIKED VIDEOS */}
        <h3 style={sectionTitle}>Liked Videos</h3>

        {likedVideos.length === 0 ? (
          <p style={emptyText}>
            You haven't liked any videos yet.
          </p>
        ) : (
          likedVideos.map((video) => (
            <div key={video.id} style={cardStyle}>
              <h4>{video.title}</h4>
              <p style={{ color: "#bbb" }}>
                {video.description}
              </p>

              <div style={buttonRow}>
                <Link to={`/video/${video.id}`}>
                  <button style={primaryButton}>
                    Watch
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------- RESPONSIVE STYLES ---------- */

const pageStyle = {
  background: "#0f0f0f",
  minHeight: "100vh",
  padding: "30px 16px",
  display: "flex",
  justifyContent: "center",
  boxSizing: "border-box",
};

const profileCard = {
  background: "#1c1c1c",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  color: "white",
  width: "100%",
  boxSizing: "border-box",
};

const sectionTitle = {
  marginTop: "35px",
  color: "white",
  fontSize: "clamp(16px, 4vw, 20px)",
};

const cardStyle = {
  background: "#1c1c1c",
  padding: "18px",
  borderRadius: "12px",
  marginTop: "15px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
  color: "white",
  width: "100%",
  boxSizing: "border-box",
};

const emptyText = {
  color: "#777",
  marginTop: "10px",
  fontSize: "14px",
};

const buttonRow = {
  marginTop: "12px",
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const primaryButton = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#ff2e63",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};

const dangerButton = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#e74c3c",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};

export default StudentProfile;
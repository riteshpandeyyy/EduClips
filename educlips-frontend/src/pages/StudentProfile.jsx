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
      <div style={{ width: "800px", maxWidth: "95%" }}>

        {/* PROFILE HEADER */}
        <div style={profileCard}>
          <h2>{user.name}</h2>
          <p style={{ color: "#aaa" }}>{user.email}</p>
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

              <div style={{ marginTop: "10px" }}>
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

              <Link to={`/video/${video.id}`}>
                <button style={primaryButton}>
                  Watch
                </button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const pageStyle = {
  background: "#0f0f0f",
  minHeight: "100vh",
  padding: "40px 0",
  display: "flex",
  justifyContent: "center",
};

const profileCard = {
  background: "#1c1c1c",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
  color: "white",
};

const sectionTitle = {
  marginTop: "40px",
  color: "white",
};

const cardStyle = {
  background: "#1c1c1c",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "15px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  color: "white",
};

const emptyText = {
  color: "#777",
  marginTop: "10px",
};

const primaryButton = {
  padding: "8px 14px",
  marginRight: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#ff2e63",
  color: "white",
  cursor: "pointer",
};

const dangerButton = {
  padding: "8px 14px",
  borderRadius: "8px",
  border: "none",
  background: "#e74c3c",
  color: "white",
  cursor: "pointer",
};

export default StudentProfile;
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Feed() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const res = await axios.get("/users/feed");
        setVideos(res.data.content || res.data);
      } catch (err) {
        console.log("Feed error:", err);
      }
    };

    loadFeed();
  }, []);

  const handleLike = async (videoId, liked) => {
    try {
        if (liked) {
        await axios.post(`/users/videos/${videoId}/unlike`);
        } else {
        await axios.post(`/users/videos/${videoId}/like`);
        }

        setVideos((prevVideos) =>
        prevVideos.map((video) =>
            video.id === videoId
            ? {
                ...video,
                likedByCurrentUser: !video.likedByCurrentUser,
                likeCount: video.likedByCurrentUser
                    ? video.likeCount - 1
                    : video.likeCount + 1,
                }
            : video
        )
        );
    } catch (err) {
        console.log("Like error:", err);
    }
    };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const openVideo = (id) => {
    navigate(`/videos/${id}`);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>🎬 EduClips Feed</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {videos.length === 0 ? (
        <p>No videos available</p>
      ) : (
        videos.map((video) => (
          <div
            key={video.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{ cursor: "pointer", color: "#0077cc" }}
              onClick={() => openVideo(video.id)}
            >
              {video.title}
            </h3>

            <p>{video.description}</p>

            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <span>👁 {video.viewCount}</span>
              <span>👍 {video.likeCount}</span>
              <span>💬 {video.commentCount}</span>
            </div>

            <button
              style={{ marginTop: "15px" }}
              onClick={() => handleLike(video.id, video.likedByCurrentUser)}
            >
              {video.likedByCurrentUser ? "Unlike" : "Like"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;
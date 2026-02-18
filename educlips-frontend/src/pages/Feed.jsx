import { useEffect, useState } from "react";
import axios from "../api/axios";

function Feed() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get("/users/feed");
        setVideos(res.data);
      } catch (err) {
        console.log("Feed error:", err);
      }
    };

    fetchFeed();
  }, []);

  const handleLike = async (videoId) => {
    try {
      await axios.post(`/users/videos/${videoId}/like`);
      
      const res = await axios.get("/users/feed");
      setVideos(res.data);

    } catch (err) {
      console.log("Like error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Feed</h2>

      <button onClick={handleLogout}>Logout</button>

      {videos.length === 0 ? (
        <p>No videos found</p>
      ) : (
        videos.map((video) => (
          <div
            key={video.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h3>{video.title}</h3>
            <p>{video.description}</p>

            <p>Views: {video.viewCount}</p>
            <p>Likes: {video.likeCount}</p>
            <p>Comments: {video.commentCount}</p>

            <button onClick={() => handleLike(video.id)}>
              {video.likedByCurrentUser ? "Unlike" : "Like"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;
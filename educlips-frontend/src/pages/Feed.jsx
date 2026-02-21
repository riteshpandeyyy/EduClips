import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

function Feed() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/users/feed");
        setVideos(res.data);
      } catch (err) {
        console.error("Feed load error:", err);
      }
    };
    load();
  }, []);

  const handleLikeToggle = async (videoId, liked) => {
    try {
      if (liked) {
        await axios.post(`/users/videos/${videoId}/unlike`);
      } else {
        await axios.post(`/users/videos/${videoId}/like`);
      }

      // 🔥 Optimistic UI update (no reload)
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? {
                ...v,
                likedByCurrentUser: !liked,
                likeCount: liked ? v.likeCount - 1 : v.likeCount + 1,
              }
            : v
        )
      );
    } catch (err) {
      console.error("Like/Unlike error:", err);
    }
  };

  return (
    <div className="container">
      <h2>Feed</h2>

      {videos.length === 0 ? (
        <p>No videos found</p>
      ) : (
        videos.map((v) => (
          <div key={v.id} className="card">
            <h3>{v.title}</h3>

            <p>
              By{" "}
              <Link to={`/creator/${v.creatorId}`}>
                <strong style={{ color: "#3498db", cursor: "pointer" }}>
                  {v.creatorName}
                </strong>
              </Link>
            </p>

            <p>{v.description}</p>

            <p>
              ❤️ {v.likeCount} &nbsp;&nbsp;
              👁 {v.viewCount} &nbsp;&nbsp;
              💬 {v.commentCount}
            </p>

            <div style={{ marginTop: "10px" }}>
              <button
                className="button"
                onClick={() =>
                  handleLikeToggle(v.id, v.likedByCurrentUser)
                }
              >
                {v.likedByCurrentUser ? "Unlike" : "Like"}
              </button>

              <Link to={`/video/${v.id}`}>
                <button
                  className="button"
                  style={{ marginLeft: "10px" }}
                >
                  Watch
                </button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;
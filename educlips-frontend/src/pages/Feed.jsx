import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

function Feed() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadVideos(0);
  }, []);

  const loadVideos = async (pageNumber) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/users/feed?page=${pageNumber}&size=5`
      );

      const newVideos = res.data.content;

      if (pageNumber === 0) {
        setVideos(newVideos);
      } else {
        setVideos((prev) => {
          const existingIds = new Set(prev.map((v) => v.id));
          const filteredNew = newVideos.filter(
            (v) => !existingIds.has(v.id)
          );
          return [...prev, ...filteredNew];
        });
      }

      setHasMore(!res.data.last);
      setPage(pageNumber);
    } catch (err) {
      console.error("Feed load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (videoId, liked) => {
    try {
      if (liked) {
        await axios.post(`/users/videos/${videoId}/unlike`);
      } else {
        await axios.post(`/users/videos/${videoId}/like`);
      }

      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? {
                ...v,
                likedByCurrentUser: !liked,
                likeCount: liked
                  ? v.likeCount - 1
                  : v.likeCount + 1,
              }
            : v
        )
      );
    } catch (err) {
      console.error("Like/Unlike error:", err);
    }
  };

  const extractVideoId = (url) => {
    if (!url) return null;

    // handle shorts
    if (url.includes("shorts/")) {
      return url.split("shorts/")[1].split("?")[0];
    }

    const regExp =
      /^.*(youtu.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="container">
      <h2>Feed</h2>

      {videos.length === 0 ? (
        <p>No videos found</p>
      ) : (
        videos.map((v) => (
          <div key={v.id} className="card">

            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "350px",
                margin: "auto",
                cursor: "pointer"
              }}
              onMouseEnter={() => setPlayingId(v.id)}
              onMouseLeave={() => setPlayingId(null)}
              onClick={() => navigate(`/video/${v.id}`)}
            >
              <iframe
                src={`https://www.youtube.com/embed/${extractVideoId(
                  v.videoUrl
                )}?${playingId === v.id
                    ? "autoplay=1&mute=1&controls=0"
                    : "autoplay=0&mute=1&controls=0"
                  }`}
                frameBorder="0"
                allow="autoplay"
                style={{
                  width: "100%",
                  height: "500px",
                  borderRadius: "15px",
                  pointerEvents: "none"  
                }}
              ></iframe>
            </div>

            <h3>{v.title}</h3>

            <p>
              By{" "}
              <Link to={`/creator/${v.creatorId}`}>
                <strong
                  style={{
                    color: "#3498db",
                    cursor: "pointer",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
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
                  handleLikeToggle(
                    v.id,
                    v.likedByCurrentUser
                  )
                }
              >
                {v.likedByCurrentUser
                  ? "Unlike"
                  : "Like"}
              </button>

              {/* 🔥 Comment Button instead of Watch */}
              <button
                className="button"
                style={{ marginLeft: "10px" }}
                onClick={() =>
                  navigate(`/video/${v.id}`)
                }
              >
                Comment
              </button>
            </div>
          </div>
        ))
      )}

      {hasMore && (
        <div style={{ marginTop: "20px" }}>
          <button
            className="button"
            onClick={() => loadVideos(page + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Feed;
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

function Feed() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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
        // prevent duplicates
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

      // Optimistic UI update
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
                <strong
                  style={{
                    color: "#3498db",
                    cursor: "pointer",
                  }}
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

      {/* Load More Button */}
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
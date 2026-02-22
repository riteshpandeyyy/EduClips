import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

function WatchVideo() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [videoRes, commentRes, userRes] = await Promise.all([
        axios.get(`/users/videos/${id}`),
        axios.get(`/users/comments/${id}`),
        axios.get("/users/me"),
      ]);

      setVideo(videoRes.data);
      setComments(commentRes.data);
      setCurrentUser(userRes.data);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    try {
      if (video.likedByCurrentUser) {
        await axios.post(`/users/videos/${id}/unlike`);
      } else {
        await axios.post(`/users/videos/${id}/like`);
      }

      setVideo((prev) => ({
        ...prev,
        likedByCurrentUser: !prev.likedByCurrentUser,
        likeCount: prev.likedByCurrentUser
          ? prev.likeCount - 1
          : prev.likeCount + 1,
      }));
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);

      const res = await axios.post("/users/comment", {
        videoId: id,
        content: newComment,
      });

      setComments((prev) => [...prev, res.data]);

      setVideo((prev) => ({
        ...prev,
        commentCount: prev.commentCount + 1,
      }));

      setNewComment("");
    } catch (err) {
      console.error("Comment error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/users/comments/${commentId}`);

      setComments((prev) =>
        prev.filter((c) => c.id !== commentId)
      );

      setVideo((prev) => ({
        ...prev,
        commentCount: prev.commentCount - 1,
      }));
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  if (loading)
    return (
      <div style={loadingStyle}>Loading...</div>
    );

  if (!video)
    return (
      <div style={loadingStyle}>Video not found</div>
    );

  const extractVideoId = (url) => {
    if (!url) return null;

    if (url.includes("shorts/")) {
      return url.split("shorts/")[1].split("?")[0];
    }

    const regExp =
      /^.*(youtu.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div style={containerStyle}>
      <div style={contentWrapper}>

        {/* Video Frame */}
        <div style={videoWrapper}>
          <iframe
            src={`https://www.youtube.com/embed/${extractVideoId(
              video.videoUrl
            )}`}
            frameBorder="0"
            allowFullScreen
            style={iframeStyle}
            title={video.title}
          ></iframe>
        </div>

        {/* Video Info */}
        <div style={infoSection}>
          <h3 style={titleStyle}>{video.title}</h3>

          <p style={descriptionStyle}>
            {video.description}
          </p>

          <div style={statsRow}>
            <span>❤️ {video.likeCount}</span>
            <span>👁 {video.viewCount}</span>
            <span>💬 {video.commentCount}</span>
          </div>

          <button
            onClick={handleLikeToggle}
            style={{
              ...likeButton,
              background: video.likedByCurrentUser
                ? "#ff2e63"
                : "#2a2a2a",
            }}
          >
            {video.likedByCurrentUser ? "Unlike" : "Like"}
          </button>
        </div>

        {/* Comments */}
        <div style={commentSection}>
          <h3 style={{ marginBottom: "15px" }}>Comments</h3>

          <div style={{ marginBottom: "20px" }}>
            <input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={commentInput}
            />

            <button
              onClick={handleAddComment}
              disabled={submitting}
              style={postButton}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>

          {comments.length === 0 ? (
            <p style={{ color: "#888" }}>No comments yet</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} style={commentCard}>
                <strong style={{ color: "#ff2e63" }}>
                  {c.userName}
                </strong>

                <p style={commentText}>
                  {c.content}
                </p>

                {currentUser &&
                  currentUser.id === c.userId && (
                    <button
                      onClick={() =>
                        handleDeleteComment(c.id)
                      }
                      style={deleteButton}
                    >
                      Delete
                    </button>
                  )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- RESPONSIVE STYLES ---------- */

const containerStyle = {
  background: "#0f0f0f",
  minHeight: "100vh",
  padding: "30px 16px",
  display: "flex",
  justifyContent: "center",
  boxSizing: "border-box",
};

const contentWrapper = {
  width: "100%",
  maxWidth: "500px",
  color: "white",
};

const videoWrapper = {
  width: "100%",
  aspectRatio: "9 / 16",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
};

const iframeStyle = {
  width: "100%",
  height: "100%",
  border: "none",
};

const infoSection = {
  marginTop: "18px",
};

const titleStyle = {
  margin: "5px 0",
  fontSize: "clamp(16px, 4vw, 20px)",
};

const descriptionStyle = {
  fontSize: "14px",
  color: "#bbb",
  lineHeight: "1.5",
};

const statsRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
  fontSize: "14px",
  color: "#999",
  marginTop: "10px",
  marginBottom: "12px",
};

const likeButton = {
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "14px",
};

const commentSection = {
  marginTop: "40px",
};

const commentInput = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #333",
  background: "#1c1c1c",
  color: "white",
  marginBottom: "10px",
  boxSizing: "border-box",
};

const postButton = {
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  background: "#ff2e63",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};

const commentCard = {
  padding: "12px",
  marginBottom: "10px",
  background: "#1c1c1c",
  borderRadius: "8px",
  fontSize: "14px",
  wordBreak: "break-word",
};

const commentText = {
  marginTop: "6px",
  color: "#ccc",
};

const deleteButton = {
  marginTop: "6px",
  background: "none",
  border: "none",
  color: "#ff2e63",
  cursor: "pointer",
  fontSize: "12px",
};

const loadingStyle = {
  background: "#0f0f0f",
  minHeight: "100vh",
  color: "white",
  padding: "40px",
};

export default WatchVideo;
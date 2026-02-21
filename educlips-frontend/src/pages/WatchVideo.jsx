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
      <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "white", padding: "40px" }}>
        Loading...
      </div>
    );

  if (!video)
    return (
      <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "white", padding: "40px" }}>
        Video not found
      </div>
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
    <div
      style={{
        background: "#0f0f0f",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "60px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "380px", color: "white" }}>
        {/* Video Frame */}
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${extractVideoId(
              video.videoUrl
            )}`}
            frameBorder="0"
            allowFullScreen
            style={{
              width: "100%",
              height: "640px",
            }}
          ></iframe>
        </div>

        {/* Video Info */}
        <div style={{ marginTop: "15px" }}>
          <h3 style={{ margin: "5px 0" }}>{video.title}</h3>

          <p style={{ fontSize: "14px", color: "#bbb" }}>
            {video.description}
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              fontSize: "14px",
              color: "#999",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <span>❤️ {video.likeCount}</span>
            <span>👁 {video.viewCount}</span>
            <span>💬 {video.commentCount}</span>
          </div>

          <button
            onClick={handleLikeToggle}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: video.likedByCurrentUser
                ? "#ff2e63"
                : "#2a2a2a",
              color: "white",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            {video.likedByCurrentUser ? "Unlike" : "Like"}
          </button>
        </div>

        {/* Comments Section */}
        <div style={{ marginTop: "40px" }}>
          <h3 style={{ marginBottom: "15px" }}>Comments</h3>

          <div style={{ marginBottom: "20px" }}>
            <input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #333",
                background: "#1c1c1c",
                color: "white",
                marginBottom: "10px",
              }}
            />

            <button
              onClick={handleAddComment}
              disabled={submitting}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#ff2e63",
                color: "white",
                cursor: "pointer",
              }}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>

          {comments.length === 0 ? (
            <p style={{ color: "#888" }}>No comments yet</p>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: "12px",
                  marginBottom: "10px",
                  background: "#1c1c1c",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                <strong style={{ color: "#ff2e63" }}>
                  {c.userName}
                </strong>
                <p style={{ marginTop: "5px", color: "#ccc" }}>
                  {c.content}
                </p>

                {currentUser &&
                  currentUser.id === c.userId && (
                    <button
                      onClick={() =>
                        handleDeleteComment(c.id)
                      }
                      style={{
                        marginTop: "5px",
                        background: "none",
                        border: "none",
                        color: "#ff2e63",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
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

export default WatchVideo;
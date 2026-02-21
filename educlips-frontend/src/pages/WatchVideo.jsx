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

      const createdComment = res.data;

      // Add comment instantly to UI
      setComments((prev) => [...prev, createdComment]);

      // Update comment count locally
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
      alert("Delete failed");
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  if (!video)
    return <div className="container">Video not found</div>;

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
      <div className="card">
         <h2>{video.title}</h2>
          <p>{video.description}</p>

          {/* YouTube Embed */}
          <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${extractVideoId(
              video.videoUrl
            )}`}
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
            style={{
              height: "80vh",          
              aspectRatio: "9 / 16",  
              borderRadius: "15px",
            }}
          ></iframe>
        </div>

          <p style={{ marginTop: "10px" }}>
            ❤️ {video.likeCount} &nbsp;&nbsp;
            👁 {video.viewCount} &nbsp;&nbsp;
            💬 {video.commentCount}
          </p>

        <button className="button" onClick={handleLikeToggle}>
          {video.likedByCurrentUser ? "Unlike" : "Like"}
        </button>
      </div>

      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Comments</h3>

        <div style={{ marginBottom: "15px" }}>
          <input
            className="input"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="button"
            onClick={handleAddComment}
            disabled={submitting}
            style={{ marginTop: "10px" }}
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>

        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              style={{
                borderTop: "1px solid #ddd",
                padding: "10px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{c.userName}</strong>
                <p>{c.content}</p>
              </div>

              {currentUser &&
                currentUser.id === c.userId && (
                  <button
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleDeleteComment(c.id)
                    }
                  >
                    Delete
                  </button>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WatchVideo;
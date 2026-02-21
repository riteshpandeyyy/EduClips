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

  if (loading) return <div className="container">Loading...</div>;
  if (!user) return <div className="container">User not found</div>;

  return (
    <div className="container">

      {/* User Info */}
      <div className="card">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>

      {/* Following Creators */}
      <h3 style={{ marginTop: "30px" }}>Following Creators</h3>

      {following.length === 0 ? (
        <p>You are not following anyone yet.</p>
      ) : (
        following.map((creator) => (
          <div key={creator.id} className="card">
            <h4>{creator.name}</h4>
            <p>{creator.bio}</p>

            <Link to={`/creator/${creator.id}`}>
              <button className="button">View Profile</button>
            </Link>

            <button
              className="button"
              style={{ marginLeft: "10px", backgroundColor: "#e74c3c" }}
              onClick={() => handleUnfollow(creator.id)}
            >
              Unfollow
            </button>
          </div>
        ))
      )}

      {/* Liked Videos */}
      <h3 style={{ marginTop: "30px" }}>Liked Videos</h3>

      {likedVideos.length === 0 ? (
        <p>You haven't liked any videos yet.</p>
      ) : (
        likedVideos.map((video) => (
          <div key={video.id} className="card">
            <h4>{video.title}</h4>
            <p>{video.description}</p>

            <Link to={`/video/${video.id}`}>
              <button className="button">Watch</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default StudentProfile;
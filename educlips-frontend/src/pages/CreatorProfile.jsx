import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axios";

function CreatorProfile() {
  const { id } = useParams();

  const [creator, setCreator] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [editedExpertise, setEditedExpertise] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const profileRes = await axios.get(`/users/creators/${id}`);
      setCreator(profileRes.data);
      setIsFollowing(profileRes.data.followedByCurrentUser);

      setEditedBio(profileRes.data.bio);
      setEditedExpertise(profileRes.data.expertise);

      try {
        const userRes = await axios.get("/users/me");
        if (userRes.data.creatorId === parseInt(id)) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch {
        setIsOwner(false);
      }

      const coursesRes = await axios.get("/users/courses");

      const creatorCourses = coursesRes.data.filter(
        (c) => c.creatorId === parseInt(id)
      );

      const coursesWithVideos = await Promise.all(
        creatorCourses.map(async (course) => {
          const videosRes = await axios.get(
            `/users/courses/${course.id}/videos`
          );
          return {
            ...course,
            videos: videosRes.data,
          };
        })
      );

      setCourses(coursesWithVideos);
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.post(`/users/creators/${id}/unfollow`);
        setIsFollowing(false);
        setCreator((prev) => ({
          ...prev,
          followers: prev.followers - 1,
        }));
      } else {
        await axios.post(`/users/creators/${id}/follow`);
        setIsFollowing(true);
        setCreator((prev) => ({
          ...prev,
          followers: prev.followers + 1,
        }));
      }
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await axios.put("/users/creators/profile", {
        bio: editedBio,
        expertise: editedExpertise,
      });

      setCreator((prev) => ({
        ...prev,
        bio: res.data.bio,
        expertise: res.data.expertise,
      }));

      setEditMode(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading)
    return (
      <div style={pageStyle}>
        <p style={{ color: "white" }}>Loading...</p>
      </div>
    );

  if (!creator)
    return (
      <div style={pageStyle}>
        <p style={{ color: "white" }}>Creator not found</p>
      </div>
    );

  return (
    <div style={pageStyle}>
      <div style={{ width: "800px", maxWidth: "95%" }}>
        
        {/* PROFILE HEADER */}
        <div style={profileCard}>
          <h2 style={{ marginBottom: "10px" }}>
            {creator.name}
          </h2>

          {editMode ? (
            <>
              <input
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                style={inputStyle}
              />
              <input
                value={editedExpertise}
                onChange={(e) => setEditedExpertise(e.target.value)}
                style={{ ...inputStyle, marginTop: "10px" }}
              />
              <button
                onClick={handleUpdateProfile}
                style={primaryButton}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <p style={{ color: "#bbb" }}>
                {creator.bio}
              </p>
              <p style={{ color: "#aaa", marginTop: "5px" }}>
                <strong>Expertise:</strong> {creator.expertise}
              </p>
            </>
          )}

          <p style={{ marginTop: "10px", color: "#888" }}>
            {creator.followers} Followers
          </p>

          <div style={{ marginTop: "15px" }}>
            {!isOwner && (
              <button
                onClick={handleFollowToggle}
                style={
                  isFollowing
                    ? secondaryButton
                    : primaryButton
                }
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}

            {isOwner && (
              <button
                onClick={() =>
                  setEditMode(!editMode)
                }
                style={secondaryButton}
              >
                {editMode
                  ? "Cancel"
                  : "Edit Profile"}
              </button>
            )}
          </div>
        </div>

        {/* COURSES */}
        <h3 style={{ marginTop: "40px", color: "white" }}>
          Published Courses
        </h3>

        {courses.length === 0 ? (
          <p style={{ color: "#888" }}>
            No courses yet
          </p>
        ) : (
          courses.map((course) => (
            <div key={course.id} style={courseCard}>
              <h4>{course.title}</h4>
              <p style={{ color: "#bbb" }}>
                {course.description}
              </p>

              {course.videos &&
                course.videos.map((video) => (
                  <div
                    key={video.id}
                    style={videoItem}
                  >
                    <span>{video.title}</span>
                    <Link
                      to={`/video/${video.id}`}
                      style={watchLink}
                    >
                      Watch →
                    </Link>
                  </div>
                ))}
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

const courseCard = {
  background: "#1c1c1c",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "20px",
  color: "white",
};

const videoItem = {
  marginTop: "10px",
  padding: "10px",
  background: "#2a2a2a",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #333",
  background: "#2a2a2a",
  color: "white",
};

const primaryButton = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#ff2e63",
  color: "white",
  cursor: "pointer",
  fontWeight: "500",
};

const secondaryButton = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#2a2a2a",
  color: "white",
  cursor: "pointer",
  fontWeight: "500",
};

const watchLink = {
  color: "#ff2e63",
  textDecoration: "none",
  fontWeight: "500",
};

export default CreatorProfile;
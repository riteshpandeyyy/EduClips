import { useEffect, useState } from "react";
import axios from "../api/axios";

function CreatorDashboard() {
  const [courses, setCourses] = useState([]);
  const [videosMap, setVideosMap] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoForms, setVideoForms] = useState({});
  const [videoData, setVideoData] = useState({});

  const loadVideos = async (courseId) => {
    try {
      const res = await axios.get(
        `/users/creator/courses/${courseId}/videos`
      );

      setVideosMap((prev) => ({
        ...prev,
        [courseId]: res.data,
      }));
    } catch (err) {
      console.error("Load videos error:", err);
    }
  };

  const loadCourses = async () => {
    try {
      const res = await axios.get("/users/creator/courses");
      setCourses(res.data);

      res.data.forEach((course) => {
        loadVideos(course.id);
      });
    } catch (err) {
      console.error("Load courses error:", err);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/users/creator/courses", {
        title,
        description,
        category,
      });

      setTitle("");
      setDescription("");
      setCategory("");

      loadCourses();
    } catch (err) {
      console.error("Create course error:", err);
      alert("Course creation failed");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <h2 style={{ color: "white", marginBottom: "20px" }}>
          Creator Studio
        </h2>

        {/* CREATE COURSE */}
        <div style={cardStyle}>
          <h3>Create Course</h3>

          <form onSubmit={handleCreateCourse}>
            <input
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={inputStyle}
            />

            <button type="submit" style={primaryButton}>
              Create Course
            </button>
          </form>
        </div>

        {/* COURSES */}
        <h3 style={{ marginTop: "40px", color: "white" }}>
          My Courses
        </h3>

        {courses.length === 0 ? (
          <p style={{ color: "#888" }}>No courses yet</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} style={cardStyle}>
              <h4>{course.title}</h4>
              <p style={{ color: "#bbb" }}>
                {course.description}
              </p>

              <p style={{ marginTop: "8px" }}>
                <span style={badgeStyle(course.published)}>
                  {course.published ? "Published" : "Draft"}
                </span>
              </p>

              {/* ACTION BUTTONS */}
              <div style={{ marginTop: "15px" }}>
                {course.published ? (
                  <button
                    style={secondaryButton}
                    onClick={async () => {
                      try {
                        await axios.post(
                          `/users/creator/courses/${course.id}/unpublish`
                        );

                        setCourses((prev) =>
                          prev.map((c) =>
                            c.id === course.id
                              ? { ...c, published: false }
                              : c
                          )
                        );
                      } catch (err) {
                        alert("Unpublish failed");
                      }
                    }}
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    style={primaryButton}
                    onClick={async () => {
                      try {
                        await axios.patch(
                          `/users/creator/courses/${course.id}/publish`
                        );

                        setCourses((prev) =>
                          prev.map((c) =>
                            c.id === course.id
                              ? { ...c, published: true }
                              : c
                          )
                        );
                      } catch (err) {
                        alert("Publish failed");
                      }
                    }}
                  >
                    Publish
                  </button>
                )}

                <button
                  style={dangerButton}
                  onClick={async () => {
                    if (!window.confirm("Delete this course and all videos?"))
                      return;

                    try {
                      await axios.delete(
                        `/users/creator/courses/${course.id}`
                      );

                      setCourses((prev) =>
                        prev.filter((c) => c.id !== course.id)
                      );
                    } catch {
                      alert("Delete failed");
                    }
                  }}
                >
                  Delete
                </button>

                <button
                  style={secondaryButton}
                  onClick={() =>
                    setVideoForms((prev) => ({
                      ...prev,
                      [course.id]: !prev[course.id],
                    }))
                  }
                >
                  Add Video
                </button>
              </div>

              {/* VIDEO FORM */}
              {videoForms[course.id] && (
                <div style={{ marginTop: "20px" }}>
                  <input
                    placeholder="Video Title"
                    style={inputStyle}
                    onChange={(e) =>
                      setVideoData((prev) => ({
                        ...prev,
                        [course.id]: {
                          ...prev[course.id],
                          title: e.target.value,
                        },
                      }))
                    }
                  />

                  <input
                    placeholder="Description"
                    style={inputStyle}
                    onChange={(e) =>
                      setVideoData((prev) => ({
                        ...prev,
                        [course.id]: {
                          ...prev[course.id],
                          description: e.target.value,
                        },
                      }))
                    }
                  />

                  <input
                    placeholder="YouTube URL"
                    style={inputStyle}
                    onChange={(e) =>
                      setVideoData((prev) => ({
                        ...prev,
                        [course.id]: {
                          ...prev[course.id],
                          videoUrl: e.target.value,
                        },
                      }))
                    }
                  />

                  <button
                    style={primaryButton}
                    onClick={async () => {
                      try {
                        const existingVideos =
                          videosMap[course.id] || [];

                        const orderIndex =
                          existingVideos.length + 1;

                        await axios.post(
                          `/users/creator/courses/${course.id}/videos`,
                          {
                            ...videoData[course.id],
                            orderIndex,
                          }
                        );

                        setVideoForms((prev) => ({
                          ...prev,
                          [course.id]: false,
                        }));

                        loadVideos(course.id);
                      } catch {
                        alert("Video creation failed");
                      }
                    }}
                  >
                    Submit Video
                  </button>
                </div>
              )}

              {/* VIDEO LIST */}
              {videosMap[course.id] &&
                videosMap[course.id].map((video) => (
                  <div key={video.id} style={videoItem}>
                    <div style={{ fontWeight: "500" }}>
                      {video.title}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {!video.published && (
                        <button
                          style={primaryButton}
                          onClick={async () => {
                            try {
                              await axios.patch(
                                `/users/creator/videos/${video.id}/publish`
                              );

                              loadVideos(course.id);
                            } catch {
                              alert("Publish failed");
                            }
                          }}
                        >
                          Publish
                        </button>
                      )}

                      <button
                        style={dangerButton}
                        onClick={async () => {
                          if (!window.confirm("Delete this video?"))
                            return;

                          try {
                            await axios.delete(
                              `/users/creator/videos/${video.id}`
                            );

                            loadVideos(course.id);
                          } catch {
                            alert("Delete failed");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
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
  padding: "30px 16px",
  display: "flex",
  justifyContent: "center",
  boxSizing: "border-box",
};

const cardStyle = {
  background: "#1c1c1c",
  padding: "20px",
  borderRadius: "16px",
  marginTop: "20px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  color: "white",
  width: "100%",
  boxSizing: "border-box",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #333",
  background: "#2a2a2a",
  color: "white",
  fontSize: "14px",
  boxSizing: "border-box",
};

const primaryButton = {
  padding: "10px 16px",
  margin: "5px 8px 5px 0",
  borderRadius: "8px",
  border: "none",
  background: "#ff2e63",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};

const secondaryButton = {
  padding: "10px 16px",
  margin: "5px 8px 5px 0",
  borderRadius: "8px",
  border: "none",
  background: "#2a2a2a",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};

const dangerButton = {
  padding: "10px 16px",
  margin: "5px 8px 5px 0",
  borderRadius: "8px",
  border: "none",
  background: "#e74c3c",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};

const badgeStyle = (published) => ({
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  background: published ? "#1f8f4e" : "#444",
  color: "white",
});

const videoItem = {
  marginTop: "12px",
  padding: "14px",
  background: "#2a2a2a",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export default CreatorDashboard;
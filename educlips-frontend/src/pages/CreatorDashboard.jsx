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

      // Load videos for each course
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
    <div className="container">
      <h2>Creator Dashboard</h2>

      {/* Create Course */}
      <div className="card">
        <h3>Create Course</h3>

        <form onSubmit={handleCreateCourse}>
          <input
            className="input"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            className="input"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <button className="button" type="submit">
            Create Course
          </button>
        </form>
      </div>

      <h3 style={{ marginTop: "30px" }}>My Courses</h3>

      {courses.length === 0 ? (
        <p>No courses yet</p>
      ) : (
        courses.map((course) => (
          <div key={course.id} className="card">
            <h4>{course.title}</h4>
            <p>{course.description}</p>
            <p>Category: {course.category}</p>

            <p>
              Status:{" "}
              <strong
                style={{
                  color: course.published ? "green" : "red",
                }}
              >
                {course.published ? "Published" : "Draft"}
              </strong>
            </p>

            {/* Publish Course */}
            {!course.published && (
              <button
                className="button"
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
                    console.error("Publish course error:", err);
                    alert("Publish failed");
                  }
                }}
              >
                Publish Course
              </button>
            )}

            {/* Add Video Button */}
            <button
              className="button"
              style={{ marginLeft: "10px" }}
              onClick={() =>
                setVideoForms((prev) => ({
                  ...prev,
                  [course.id]: !prev[course.id],
                }))
              }
            >
              Add Video
            </button>

            {/* Add Video Form */}
            {videoForms[course.id] && (
              <div style={{ marginTop: "15px" }}>
                <input
                  className="input"
                  placeholder="Video Title"
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
                  className="input"
                  placeholder="Description"
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
                  className="input"
                  placeholder="YouTube URL"
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

                <input
                  className="input"
                  type="number"
                  placeholder="Order Index"
                  onChange={(e) =>
                    setVideoData((prev) => ({
                      ...prev,
                      [course.id]: {
                        ...prev[course.id],
                        orderIndex: parseInt(e.target.value),
                      },
                    }))
                  }
                />

                <button
                  className="button"
                  onClick={async () => {
                    try {
                      await axios.post(
                        `/users/creator/courses/${course.id}/videos`,
                        videoData[course.id]
                      );

                      alert("Video added successfully");

                      setVideoForms((prev) => ({
                        ...prev,
                        [course.id]: false,
                      }));

                      loadVideos(course.id); // refresh video list
                    } catch (err) {
                      console.error("Add video error:", err);
                      alert("Video creation failed");
                    }
                  }}
                >
                  Submit Video
                </button>
              </div>
            )}

            {/* Video List */}
            {videosMap[course.id] && (
              <div style={{ marginTop: "20px" }}>
                <h5>Course Videos</h5>

                {videosMap[course.id].length === 0 ? (
                  <p>No videos yet</p>
                ) : (
                  videosMap[course.id].map((video) => (
                    <div
                      key={video.id}
                      style={{
                        border: "1px solid #eee",
                        padding: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <strong>{video.title}</strong> —{" "}
                      <span
                        style={{
                          color: video.published
                            ? "green"
                            : "orange",
                        }}
                      >
                        {video.published
                          ? "Published"
                          : "Draft"}
                      </span>

                      {!video.published && (
                        <button
                          className="button"
                          style={{ marginLeft: "10px" }}
                          onClick={async () => {
                            try {
                              await axios.patch(
                                `/users/creator/videos/${video.id}/publish`
                              );

                              setVideosMap((prev) => ({
                                ...prev,
                                [course.id]: prev[
                                  course.id
                                ].map((v) =>
                                  v.id === video.id
                                    ? {
                                        ...v,
                                        published: true,
                                      }
                                    : v
                                ),
                              }));
                            } catch (err) {
                              console.error(
                                "Publish video error:",
                                err
                              );
                              alert(
                                "Video publish failed"
                              );
                            }
                          }}
                        >
                          Publish Video
                        </button>

                        
                      )}

                      <button
                        className="button"
                        style={{
                          backgroundColor: "#e74c3c",
                          marginLeft: "10px",
                        }}
                        onClick={async () => {
                          const confirmDelete = window.confirm(
                            "Are you sure you want to delete this video?"
                          );
                          if (!confirmDelete) return;

                          try {
                            await axios.delete(
                              `/users/creator/videos/${video.id}`
                            );

                            // 🔥 Remove instantly from UI
                            setVideosMap((prev) => ({
                              ...prev,
                              [course.id]: prev[course.id].filter(
                                (v) => v.id !== video.id
                              ),
                            }));
                          } catch (err) {
                            console.error("Delete error:", err);
                            alert("Delete failed");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CreatorDashboard;
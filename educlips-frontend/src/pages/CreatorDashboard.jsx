import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function CreatorDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        await axios.get("/users/creator/profile");
        const res = await axios.get("/users/creator/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Creator profile missing:", err);
        navigate("/create-profile");
      }
    };

    loadData();
  }, [navigate]); // ✅ dependency included

  const refreshCourses = async () => {
    try {
      const res = await axios.get("/users/creator/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Refresh courses error:", err);
    }
  };

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

      await refreshCourses();
    } catch (err) {
      console.error("Create course error:", err);
      alert("Failed to create course");
    }
  };

  const handlePublish = async (courseId) => {
    try {
      await axios.patch(`/users/creator/courses/${courseId}/publish`);
      await refreshCourses();
    } catch (err) {
      console.error("Publish error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Creator Dashboard</h2>

      <h3>Create Course</h3>
      <form onSubmit={handleCreateCourse}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Create Course</button>
      </form>

      <hr />

      <h3>My Courses</h3>

      {courses.length === 0 ? (
        <p>No courses yet</p>
      ) : (
        courses.map((course) => (
          <div
            key={course.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h4>{course.title}</h4>
            <p>{course.description}</p>
            <p>Category: {course.category}</p>
            <p>Published: {course.published ? "Yes" : "No"}</p>

            {!course.published && (
              <button onClick={() => handlePublish(course.id)}>
                Publish
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CreatorDashboard;
import { useEffect, useState } from "react";
import axios from "../api/axios";

function CreatorDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("/users/creator/courses");
      setCourses(res.data);
    };
    load();
  }, []);

  const createCourse = async () => {
    await axios.post("/users/creator/courses", {
      title,
      description: "Course description",
      category: "General"
    });
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Creator Dashboard</h2>

      <input
        placeholder="Course title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={createCourse}>Create</button>

      <hr />

      {courses.map((c) => (
        <div key={c.id}>
          {c.title}
        </div>
      ))}
    </div>
  );
}

export default CreatorDashboard;
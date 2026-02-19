import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

function Feed() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("/users/feed");
      setVideos(res.data);
    };
    load();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Feed</h2>

      {videos.map((v) => (
        <div key={v.id} style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}>
          <h3>{v.title}</h3>
          <p>{v.description}</p>
          <p>Likes: {v.likeCount}</p>
          <Link to={`/video/${v.id}`}>Watch</Link>
        </div>
      ))}
    </div>
  );
}

export default Feed;
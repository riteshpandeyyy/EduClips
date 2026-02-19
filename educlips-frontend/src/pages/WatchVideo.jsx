import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

function WatchVideo() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(`/users/videos/${id}`);
      setVideo(res.data);
    };
    load();
  }, [id]);

  if (!video) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{video.title}</h2>
      <p>{video.description}</p>
      <a href={video.videoUrl} target="_blank">Watch on YouTube</a>
    </div>
  );
}

export default WatchVideo;
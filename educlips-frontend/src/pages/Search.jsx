import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "../api/axios";

function Search() {
  const query = new URLSearchParams(useLocation().search);
  const keyword = query.get("keyword");

  const [videos, setVideos] = useState([]);
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    const loadSearch = async () => {
      try {
        const res = await axios.get(
          `/users/search?keyword=${keyword}`
        );

        setVideos(res.data.videos);
        setCreators(res.data.creators);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    if (keyword) loadSearch();
  }, [keyword]);

  return (
    <div className="container">
      <h2>Search Results for "{keyword}"</h2>

      <h3>Creators</h3>
      {creators.length === 0 ? (
        <p>No creators found</p>
      ) : (
        creators.map((c) => (
          <div key={c.id} className="card">
            <Link to={`/creator/${c.id}`}>
              <strong>{c.name}</strong>
            </Link>
            <p>{c.bio}</p>
          </div>
        ))
      )}

      <h3 style={{ marginTop: "20px" }}>Videos</h3>
      {videos.length === 0 ? (
        <p>No videos found</p>
      ) : (
        videos.map((v) => (
          <div key={v.id} className="card">
            <Link to={`/video/${v.id}`}>
              <strong>{v.title}</strong>
            </Link>
            <p>{v.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Search;
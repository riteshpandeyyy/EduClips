import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "../api/axios";

function Search() {
  const query = new URLSearchParams(useLocation().search);
  const keyword = query.get("keyword");

  const [videos, setVideos] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSearch = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `/users/search?keyword=${keyword}`
        );

        setVideos(res.data.videos || []);
        setCreators(res.data.creators || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (keyword) loadSearch();
  }, [keyword]);

  return (
    <div style={pageStyle}>
      <div style={{ width: "800px", maxWidth: "95%" }}>
        <h2 style={{ color: "white" }}>
          Search Results for{" "}
          <span style={{ color: "#ff2e63" }}>
            "{keyword}"
          </span>
        </h2>

        {loading && (
          <p style={{ color: "#aaa" }}>Searching...</p>
        )}

        {/* -------- Creators -------- */}
        <h3 style={sectionTitle}>Creators</h3>

        {creators.length === 0 ? (
          <p style={emptyText}>
            No creators found.
          </p>
        ) : (
          creators.map((c) => (
            <Link
              key={c.id}
              to={`/creator/${c.id}`}
              style={{ textDecoration: "none" }}
            >
              <div style={cardStyle}>
                <h4 style={{ marginBottom: "5px" }}>
                  {c.name}
                </h4>
                <p style={{ color: "#bbb" }}>
                  {c.bio}
                </p>
              </div>
            </Link>
          ))
        )}

        {/* -------- Videos -------- */}
        <h3 style={sectionTitle}>Videos</h3>

        {videos.length === 0 ? (
          <p style={emptyText}>
            No videos found.
          </p>
        ) : (
          videos.map((v) => (
            <Link
              key={v.id}
              to={`/video/${v.id}`}
              style={{ textDecoration: "none" }}
            >
              <div style={cardStyle}>
                <h4 style={{ marginBottom: "5px" }}>
                  {v.title}
                </h4>
                <p style={{ color: "#bbb" }}>
                  {v.description}
                </p>
              </div>
            </Link>
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

const sectionTitle = {
  marginTop: "40px",
  color: "white",
};

const cardStyle = {
  background: "#1c1c1c",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "15px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  color: "white",
  transition: "0.3s",
};

const emptyText = {
  color: "#777",
  marginTop: "10px",
};

export default Search;
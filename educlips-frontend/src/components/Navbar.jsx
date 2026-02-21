import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getRole, isLoggedIn, logout } from "../utils/auth";

function Navbar() {
  const role = getRole();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleLogout = () => {
    logout();
    localStorage.clear();
    window.location.href = "/";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    setKeyword("");
  };

  return (
    <nav
      style={{
        padding: "15px 30px",
        background: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left Side */}
      <div>
        <Link to="/feed">Home</Link>

        {role === "CREATOR" && (
          <>
            {" | "}
            <Link to="/dashboard">Dashboard</Link>
            {" | "}
            <Link to="/my-profile">My Profile</Link>
          </>
        )}

        {role === "STUDENT" && (
          <>
            {" | "}
            <Link to="/profile">Profile</Link>
          </>
        )}
      </div>

      {/* Center - Search */}
      {isLoggedIn() && (
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: "8px" }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              outline: "none",
            }}
          />

          <button
            type="submit"
            className="button"
            style={{ padding: "6px 12px" }}
          >
            Search
          </button>
        </form>
      )}

      {/* Right Side */}
      {isLoggedIn() && (
        <button className="button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
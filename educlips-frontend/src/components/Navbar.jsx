import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { getRole, isLoggedIn, logout } from "../utils/auth";

function Navbar() {
  const role = getRole();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const loadNotifications = async () => {
    try {
      const res = await axios.get("/users/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Notification load error:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      loadNotifications();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/");
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/users/notifications/${id}/read`);
      loadNotifications();
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) return;
    navigate(`/search?keyword=${searchKeyword}`);
    setSearchKeyword("");
  };

  return (
    <nav style={navStyle}>
      {/* LEFT SIDE */}
      <div style={leftSection}>
        <Link to="/feed" style={logoStyle}>
          EDUCLIPS
        </Link>

        <NavLink to="/feed">Home</NavLink>

        {role === "CREATOR" && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/my-profile">My Profile</NavLink>
          </>
        )}

        {role === "STUDENT" && (
          <NavLink to="/profile">Profile</NavLink>
        )}
      </div>

      {/* CENTER SEARCH */}
      {isLoggedIn() && (
        <form onSubmit={handleSearch} style={searchFormStyle}>
          <input
            type="text"
            placeholder="Search creators or videos..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={searchInputStyle}
          />
          <button type="submit" style={searchButtonStyle}>
            Search
          </button>
        </form>
      )}

      {/* RIGHT SIDE */}
      {isLoggedIn() && (
        <div style={rightSection} ref={dropdownRef}>
          <div
            style={notificationIcon}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            🔔
            {unreadCount > 0 && (
              <span style={badgeStyle}>{unreadCount}</span>
            )}
          </div>

          {showDropdown && (
            <div style={dropdownStyle}>
              {notifications.length === 0 ? (
                <p style={{ color: "#888" }}>No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    style={{
                      padding: "12px",
                      marginBottom: "8px",
                      background: n.read ? "#252525" : "#2d1b26",
                      borderRadius: "8px",
                      cursor: "pointer",
                      color: "white",
                      fontSize: "14px",
                    }}
                  >
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}

          <button onClick={handleLogout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

/* ---------- RESPONSIVE STYLES ---------- */

const navStyle = {
  position: "sticky",
  top: 0,
  zIndex: 1000,
  padding: "12px 16px",
  background: "#0f0f0f",
  borderBottom: "1px solid #222",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
};

const leftSection = {
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  alignItems: "center",
};

const rightSection = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
  position: "relative",
};

const logoStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#ff2e63",
  textDecoration: "none",
  letterSpacing: "1px",
};

const searchFormStyle = {
  display: "flex",
  flex: "1",
  minWidth: "200px",
  maxWidth: "100%",
};

const searchInputStyle = {
  flex: "1",
  padding: "8px 10px",
  borderRadius: "8px 0 0 8px",
  border: "1px solid #333",
  background: "#1c1c1c",
  color: "white",
  outline: "none",
  minWidth: 0,
};

const searchButtonStyle = {
  padding: "8px 12px",
  borderRadius: "0 8px 8px 0",
  border: "none",
  background: "#ff2e63",
  color: "white",
  cursor: "pointer",
};

const logoutButtonStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#ff2e63",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "13px",
};

const notificationIcon = {
  cursor: "pointer",
  position: "relative",
  fontSize: "18px",
};

const badgeStyle = {
  position: "absolute",
  top: "-6px",
  right: "-8px",
  background: "#ff2e63",
  color: "white",
  borderRadius: "50%",
  fontSize: "10px",
  padding: "4px 6px",
  fontWeight: "600",
};

const dropdownStyle = {
  position: "absolute",
  top: "40px",
  right: 0,
  width: "280px",
  maxWidth: "90vw",
  background: "#1c1c1c",
  borderRadius: "12px",
  padding: "15px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
  maxHeight: "400px",
  overflowY: "auto",
};

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: "#ccc",
        fontWeight: "500",
        fontSize: "13px",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => (e.target.style.color = "white")}
      onMouseLeave={(e) => (e.target.style.color = "#ccc")}
    >
      {children}
    </Link>
  );
}

export default Navbar;
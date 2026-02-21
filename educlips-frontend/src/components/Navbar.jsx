import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { getRole, isLoggedIn, logout } from "../utils/auth";

function Navbar() {
  const role = getRole();

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

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

  // Close dropdown if clicked outside
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
    window.location.href = "/";
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/users/notifications/${id}/read`);

      // 🔥 Always reload from backend (no stale state)
      loadNotifications();

    } catch (err) {
      console.error("Mark read error:", err);
    }
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

      {isLoggedIn() && (
        <div
          style={{
            position: "relative",
            display: "flex",
            gap: "20px",
            alignItems: "center"
          }}
          ref={dropdownRef}
        >

          {/* 🔔 Notification Bell */}
          <div
            style={{ cursor: "pointer", position: "relative" }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            🔔

            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-10px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: "12px",
                  padding: "3px 6px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: "60px",
                width: "300px",
                background: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                padding: "10px",
                maxHeight: "400px",
                overflowY: "auto",
                zIndex: 1000
              }}
            >
              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    style={{
                      padding: "10px",
                      marginBottom: "5px",
                      background: n.read ? "#f9f9f9" : "#eaf4ff",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}

          <button className="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
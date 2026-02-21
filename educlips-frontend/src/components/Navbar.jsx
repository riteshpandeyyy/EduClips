import { Link } from "react-router-dom";
import { getRole, isLoggedIn, logout } from "../utils/auth";

function Navbar() {
  const role = getRole();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav
  style={{
    padding: "15px 30px",
    background: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
  }}
>
  <div>
    <Link to="/feed">Home</Link>
    {role === "CREATOR" && (
      <>
        {" | "}
        <Link to="/creator-check">Dashboard</Link>
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
    <button className="button" onClick={handleLogout}>
      Logout
    </button>
  )}
</nav>
  );
}

export default Navbar;
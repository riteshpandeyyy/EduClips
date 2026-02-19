import { Link } from "react-router-dom";
import { getRole, isLoggedIn, logout } from "../utils/auth";

function Navbar() {
  const role = getRole();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav style={{ padding: "15px", borderBottom: "1px solid gray" }}>
      <Link to="/feed">Feed</Link>

      {role === "CREATOR" && (
        <>
          {" | "}
          <Link to="/creator-check">Dashboard</Link>
        </>
      )}

      {!isLoggedIn() && (
        <>
          {" | "}
          <Link to="/">Login</Link>
          {" | "}
          <Link to="/signup">Signup</Link>
        </>
      )}

      {isLoggedIn() && (
        <button
          onClick={handleLogout}
          style={{ marginLeft: "15px" }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/feed");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/users/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role =
        payload.role ||
        payload.roles ||
        payload.authorities ||
        payload.auth;

      localStorage.setItem("role", role);

      if (role === "CREATOR" || role === "ROLE_CREATOR") {
        window.location.href = "/creator-check";
      } else {
        window.location.href = "/feed";
      }
      } catch (err) {

      // Server not reachable / cold start
      if (!err.response) {
        alert(
          "Server is waking up. This may take 30-60 seconds."
        );

      // Wrong credentials
      } else if (err.response.status === 401) {
        alert("Invalid email or password.");

      // Validation error
      } else if (err.response.status === 400) {
        alert("Please check your input.");

      // Other server errors
      } else {
        alert("Something went wrong. Please try again.");
      }
    }finally {    setLoading(false); 
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>
          Welcome Back
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        <p style={bottomText}>
          Don't have an account?{" "}
          <Link to="/signup" style={linkStyle}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ---------- RESPONSIVE STYLES ---------- */

const containerStyle = {
  minHeight: "100vh",
  background: "#0f0f0f",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  padding: "20px",
  boxSizing: "border-box",
};

const cardStyle = {
  width: "100%",
  maxWidth: "400px",
  background: "#1c1c1c",
  padding: "32px",
  borderRadius: "16px",
  boxShadow: "0 0 40px rgba(0,0,0,0.6)",
  boxSizing: "border-box",
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "25px",
  fontSize: "clamp(20px, 5vw, 26px)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #333",
  background: "#2a2a2a",
  color: "white",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#ff2e63",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
};

const bottomText = {
  marginTop: "20px",
  textAlign: "center",
  fontSize: "14px",
};

const linkStyle = {
  color: "#ff2e63",
  textDecoration: "none",
  fontWeight: "500",
};

export default Login;
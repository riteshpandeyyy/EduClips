import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/feed");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

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
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "#1c1c1c",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 0 40px rgba(0,0,0,0.6)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
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

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#ff2e63" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #333",
  background: "#2a2a2a",
  color: "white",
  outline: "none",
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
  transition: "0.3s",
};

export default Login;
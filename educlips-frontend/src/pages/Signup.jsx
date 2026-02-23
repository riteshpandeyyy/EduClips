import { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

function Signup() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/users/signup", form);
      alert("Signup successful");
      window.location.href = "/";
    } catch (err) {

      // Server not reachable / cold start
      if (!err.response) {
        alert(
          "Server is waking up. This may take 30-60 seconds."
        );

      // Email already exists (most backends return 409)
      } else if (err.response.status === 409) {
        alert("Email already registered. Please login instead.");

      // Validation error (bad input)
      } else if (err.response.status === 400) {
        alert("Please check your input fields.");

      // Other server errors
      } else {
        alert("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>
          Create Account
        </h2>

        <form onSubmit={handleSignup}>
          <input
            placeholder="Name"
            required
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            style={inputStyle}
          />

          <select
            style={inputStyle}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="STUDENT">Student</option>
            <option value="CREATOR">Creator</option>
          </select>

          <button
            type="submit"
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Signup"}
          </button>
        </form>

        <p style={bottomText}>
          Already have an account?{" "}
          <Link to="/" style={linkStyle}>
            Login
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
  maxWidth: "420px",
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
  fontSize: "14px",
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
  fontSize: "14px",
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

export default Signup;
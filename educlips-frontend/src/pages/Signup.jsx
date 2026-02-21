import { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/users/signup", form);
      alert("Signup successful");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Signup failed");
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
          width: "400px",
          background: "#1c1c1c",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 0 40px rgba(0,0,0,0.6)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
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

          <button type="submit" style={buttonStyle}>
            Signup
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#ff2e63" }}>
            Login
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
};

export default Signup;
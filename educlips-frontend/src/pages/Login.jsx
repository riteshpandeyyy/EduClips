import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/users/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      // Decode JWT
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      // Role-based redirect
      if (role === "CREATOR") {
        navigate("/creator/dashboard");
      } else {
        navigate("/feed");
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      <br />

      <p>
        Don't have an account?{" "}
        <button onClick={() => navigate("/signup")}>
          Signup
        </button>
      </p>
    </div>
  );
}

export default Login;
import { useState } from "react";
import axios from "../api/axios";

function Login() {
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

        // decode JWT
        const payload = JSON.parse(atob(token.split(".")[1]));

        // check what key contains role
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
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
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
    </div>
  );
}

export default Login;
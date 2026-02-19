import { useState } from "react";
import axios from "../api/axios";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT"
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
    <div style={{ padding: "20px" }}>
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />
        <br /><br />

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />
        <br /><br />

        <select
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="STUDENT">Student</option>
          <option value="CREATOR">Creator</option>
        </select>

        <br /><br />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
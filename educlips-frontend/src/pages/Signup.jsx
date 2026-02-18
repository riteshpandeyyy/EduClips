import { useState } from "react";
import axios from "../api/axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  const handleSignup = async () => {
    try {
      await axios.post("/users/signup", {
        name,
        email,
        password,
        role,
      });

      alert("Signup successful");
    } catch (err) {
        console.log(err);
      alert("Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="STUDENT">Student</option>
        <option value="CREATOR">Creator</option>
      </select>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;
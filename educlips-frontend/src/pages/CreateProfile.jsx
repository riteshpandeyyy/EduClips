import { useState } from "react";
import axios from "../api/axios";

function CreateProfile() {
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/users/creator/profile", {
        bio,
        expertise,
      });

      window.location.href = "/dashboard";
    } catch {
      alert("Profile creation failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Creator Profile</h2>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Bio"
          onChange={(e) => setBio(e.target.value)}
          required
        />
        <br /><br />

        <input
          placeholder="Expertise"
          onChange={(e) => setExpertise(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}

export default CreateProfile;
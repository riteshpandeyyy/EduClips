import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function CreateProfile() {
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState("");
  const navigate = useNavigate();

  const handleCreateProfile = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/users/creator/profile", {
        bio,
        expertise,
      });

      alert("Profile created successfully");
      navigate("/creator/dashboard");
    } catch (err) {
      console.log("Create profile error:", err);
      alert("Failed to create profile");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Creator Profile</h2>

      <form onSubmit={handleCreateProfile}>
        <input
          type="text"
          placeholder="Your bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Your expertise"
          value={expertise}
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
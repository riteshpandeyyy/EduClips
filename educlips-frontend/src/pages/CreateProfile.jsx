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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: "40px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 0 20px rgba(255,0,0,0.1)",
        }}
      >
        <h2
          style={{
            color: "white",
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          Create Creator Profile
        </h2>

        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#bbb", fontSize: "14px" }}>
              Bio
            </label>
            <textarea
              placeholder="Tell something about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              style={{
                width: "100%",
                marginTop: "6px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #333",
                backgroundColor: "#111",
                color: "white",
                resize: "none",
                height: "80px",
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ color: "#bbb", fontSize: "14px" }}>
              Expertise
            </label>
            <input
              placeholder="e.g. Java, DSA, Web Development"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              required
              style={{
                width: "100%",
                marginTop: "6px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #333",
                backgroundColor: "#111",
                color: "white",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#ff1e1e",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#cc0000")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#ff1e1e")
            }
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProfile;
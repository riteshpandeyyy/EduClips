import { useEffect } from "react";
import axios from "../api/axios";

function CreatorCheck() {
  useEffect(() => {
    const check = async () => {
      try {
        await axios.get("/users/creator/profile");
        window.location.href = "/dashboard";
      } catch {
        window.location.href = "/create-profile";
      }
    };

    check();
  }, []);

  return <p>Checking profile...</p>;
}

export default CreatorCheck;
import { useEffect } from "react";
import axios from "../api/axios";

function Home() {

  useEffect(() => {
    const testAuth = async () => {
      try {
        const res = await axios.get("/users/feed");
        console.log("SUCCESS:", res.data);
      } catch (err) {
        console.log("ERROR STATUS:", err.response?.status);
      }
    };

    testAuth();
  }, []);

  return <h2>Home Page</h2>;
}

export default Home;

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Signup from "./pages/Signup";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreateProfile from "./pages/CreateProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/creator/dashboard" element={<CreatorDashboard />} />
      <Route path="/create-profile" element={<CreateProfile />} />
    </Routes>
  );
}

export default App;
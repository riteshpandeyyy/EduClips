import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import WatchVideo from "./pages/WatchVideo";
import CreatorCheck from "./pages/CreatorCheck";
import CreateProfile from "./pages/CreateProfile";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorProfile from "./pages/CreatorProfile";
import StudentProfile from "./pages/StudentProfile";
import MyProfileRedirect from "./pages/MyProfileRedirect";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/video/:id" element={<WatchVideo />} />
        <Route path="/creator-check" element={<CreatorCheck />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/dashboard" element={<CreatorDashboard />} />
        <Route path="/creator/:id" element={<CreatorProfile />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/my-profile" element={<MyProfileRedirect />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
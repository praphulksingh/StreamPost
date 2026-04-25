import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../src/layout/MainLayout";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import VideoDetail from "./pages/VideoDetail";
import ChannelProfile from "./pages/ChannelProfile"; 
import Dashboard from "./pages/Dashboard";   
import History from "./pages/History";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";



function App() {
  return (
    <Router>
      <Routes>
        {/* Public / Auth Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main App Routes wrapped in the Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          {/* We will add more routes here later (e.g., /video/:id, /channel/:id) */}
          <Route path="/video/:videoId" element={<VideoDetail />} />
          <Route path="/channel/:username" element={<ChannelProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
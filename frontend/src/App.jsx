import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../src/layout/MainLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import VideoDetail from "./pages/VideoDetail";
import ChannelProfile from "./pages/ChannelProfile"; 
import Dashboard from "./pages/Dashboard";   
import History from "./pages/History";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import Search from "./pages/Search";
import Trending from "./pages/Trending";
import Settings from "./pages/Settings";
import LikedVideos from "./pages/LikedVideos";
import WatchLater from "./pages/WatchLater";
import Subscriptions from "./pages/Subscriptions"; // Added Subscriptions import

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Public / Auth Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main App Routes wrapped in the Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/video/:videoId" element={<VideoDetail />} />
            <Route path="/channel/:username" element={<ChannelProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/history" element={<History />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
            <Route path="/liked-videos" element={<LikedVideos />} />
            <Route path="/watch-later" element={<WatchLater />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
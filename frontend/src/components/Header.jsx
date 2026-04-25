import { useState } from "react"; // ADD THIS
import { FiMenu, FiSearch, FiBell, FiUser, FiLogOut, FiUpload } from "react-icons/fi"; // Added FiUpload
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import VideoUploadModal from "./VideoUploadModal"; // ADD THIS

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout(); // Clear the global context state
      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-brand-dark border-b border-brand-secondary sticky top-0 z-50">
      {/* --- Logo Section --- */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-brand-secondary rounded-full transition-colors">
          <FiMenu className="w-6 h-6 text-brand-text" />
        </button>
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <span className="text-brand-accent text-2xl">▶</span>
          <span className="hidden sm:block tracking-tighter">ChaiTube</span>
        </Link>
      </div>

      {/* --- Search Section --- */}
      <div className="flex-1 max-w-2xl px-4 flex justify-center">
        <form className="flex w-full max-w-[600px] items-center" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-brand-dark border border-brand-secondary rounded-l-full px-4 py-2 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all text-white"
          />
          <button type="submit" className="bg-brand-secondary px-5 py-2 border border-l-0 border-brand-secondary rounded-r-full hover:bg-opacity-80 transition-all">
            <FiSearch className="w-5 h-5 text-brand-text" />
          </button>
        </form>
      </div>

      {/* --- Auth / User Section --- */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 hover:bg-brand-secondary rounded-full transition-colors hidden sm:block">
          <FiBell className="w-6 h-6 text-brand-text" />
        </button>

        {/* Conditional Rendering based on Auth State */}
        {user ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="p-2 hover:bg-brand-secondary rounded-full transition-colors text-brand-text hidden sm:block"
              title="Upload Video"
            >
              <FiUpload className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <Link to={`/channel/${user.username}`}>
              <img
                src={user.avatar}
                alt={user.username}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-brand-secondary hover:border-brand-accent transition-colors"
                title="Your Channel"
              />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-brand-secondary rounded-full transition-colors text-brand-muted hover:text-red-400"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
           
            <VideoUploadModal 
              isOpen={isUploadOpen} 
              onClose={() => setIsUploadOpen(false)} 
            />
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-2 bg-brand-secondary hover:bg-brand-accent hover:text-white px-4 py-2 rounded-full font-medium transition-colors border border-brand-secondary hover:border-brand-accent">
            <FiUser className="w-5 h-5" />
            <span className="hidden sm:block">Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
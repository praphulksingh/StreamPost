import { FiHome, FiTrendingUp, FiYoutube, FiFolder, FiClock, FiThumbsUp, FiSettings, FiPieChart } from "react-icons/fi";
import { MdHistory } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 👇 FIX: Accepting isOpen as a prop
const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useAuth();

  const mainLinks = [
    { icon: <FiHome />, label: "Home", path: "/" },
    { icon: <FiTrendingUp />, label: "Trending", path: "/trending" },
    { icon: <FiYoutube />, label: "Subscriptions", path: "/subscriptions" },
  ];

  const userLinks = [
    { icon: <FiFolder />, label: "Playlists", path: "/playlists" },
    { icon: <MdHistory />, label: "History", path: "/history" },
    { icon: <FiClock />, label: "Watch Later", path: "/watch-later" },
    { icon: <FiThumbsUp />, label: "Liked Videos", path: "/liked-videos" },
  ];

  // 👇 FIX: Add Dashboard if user is logged in
  if (user) {
    userLinks.push({ icon: <FiPieChart />, label: "Dashboard", path: "/dashboard" });
  }
  userLinks.push({ icon: <FiSettings />, label: "Settings", path: "/settings" });

  const NavItem = ({ icon, label, path }) => {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        className={`flex items-center px-3 py-3 rounded-xl transition-all ${
          isActive ? "bg-brand-secondary font-bold text-white" : "hover:bg-brand-secondary text-brand-text"
        } ${isOpen ? "gap-4 justify-start" : "justify-center"}`}
      >
        <span className="text-xl shrink-0">{icon}</span>
        {/* 👇 FIX: Hide text if sidebar is collapsed */}
        <span className={`text-sm truncate transition-all duration-200 ${isOpen ? "opacity-100 w-auto block" : "opacity-0 w-0 hidden"}`}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    // 👇 FIX: Mobile sliding classes and desktop collapse classes
    <aside 
      className={`fixed sm:static z-40 flex-shrink-0 border-r border-brand-secondary h-full overflow-y-auto py-4 px-2 bg-brand-dark custom-scrollbar transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full sm:translate-x-0 sm:w-16"}
      `}
    >
      <div className="flex flex-col gap-1 mb-4 border-b border-brand-secondary pb-4">
        {mainLinks.map((link) => (
          <NavItem key={link.label} {...link} />
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {isOpen && <h3 className="px-3 py-2 text-sm font-semibold text-brand-muted uppercase tracking-wider">You</h3>}
        {userLinks.map((link) => (
          <NavItem key={link.label} {...link} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
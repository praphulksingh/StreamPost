
import { FiHome, FiTrendingUp, FiYoutube, FiFolder, FiClock, FiThumbsUp, FiSettings } from "react-icons/fi";
import { MdHistory } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const mainLinks = [
    { icon: <FiHome />, label: "Home", path: "/" },
    { icon: <FiTrendingUp />, label: "Trending", path: "/trending" },
    { icon: <FiYoutube />, label: "Subscriptions", path: "/subscriptions" },
    { icon: <FiSettings />, label: "Settings", path: "/settings" },
  ];

  const userLinks = [
    { icon: <FiFolder />, label: "Playlists", path: "/playlists" },
    { icon: <MdHistory />, label: "History", path: "/history" },
    { icon: <FiClock />, label: "Watch Later", path: "/watch-later" },
    { icon: <FiThumbsUp />, label: "Liked Videos", path: "/liked-videos" },
  ];

  const NavItem = ({ icon, label, path }) => {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
          isActive ? "bg-brand-secondary font-bold text-white" : "hover:bg-brand-secondary text-brand-text"
        }`}
      >
        <span className="text-xl">{icon}</span>
        <span className="text-sm hidden lg:block truncate">{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-16 lg:w-64 flex-shrink-0 border-r border-brand-secondary h-full overflow-y-auto py-4 px-2 bg-brand-dark custom-scrollbar">
      <div className="flex flex-col gap-1 mb-4 border-b border-brand-secondary pb-4">
        {mainLinks.map((link) => (
          <NavItem key={link.label} {...link} />
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="hidden lg:block px-3 py-2 text-sm font-semibold text-brand-muted uppercase tracking-wider">You</h3>
        {userLinks.map((link) => (
          <NavItem key={link.label} {...link} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
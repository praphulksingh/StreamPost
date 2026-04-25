import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-brand-dark text-brand-text">
      {/* Fixed Top Navigation */}
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Side Navigation */}
        <Sidebar />
        
        {/* Main Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-brand-dark">
          {/* Outlet renders the current route's component (e.g., Home) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
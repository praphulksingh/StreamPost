import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  // Start with sidebar open on desktop, closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 640);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-brand-dark text-brand-text">
      {/* Pass the toggle function to the Header */}
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* MOBILE OVERLAY: Darkens background and closes sidebar when clicked */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-30 sm:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Pass the open state to the Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-brand-dark custom-scrollbar w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
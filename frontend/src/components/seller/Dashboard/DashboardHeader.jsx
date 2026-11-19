import React from 'react';
import { Menu } from 'lucide-react';

const DashboardHeader = ({ setIsSidebarOpen }) => {
  return (
    <div className="flex items-center justify-between mb-6 neu-panel p-5 mt-4 relative z-50 transition-all duration-300 rounded-2xl">
      <div className="flex items-center gap-4">
        <h2 className="font-bold text-xl text-[var(--text-main)] tracking-tight">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <button 
          type="button"
          onClick={() => setIsSidebarOpen(true)} 
          className="p-2.5 neu-button cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu size={22} className="text-[var(--text-main)]" />
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;

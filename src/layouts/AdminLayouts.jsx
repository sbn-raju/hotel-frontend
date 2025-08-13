import React, { useState } from 'react';
import { Bell, Heart, Shield, Clock } from 'lucide-react';
import ModernSidebar from '../components/admin/Sidebar/Sidebar'; // Adjust path as needed
import { Outlet } from 'react-router-dom';

const AdminLayouts = () => {
  const [activeItem, setActiveItem] = useState('Rooms');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ModernSidebar 
        activeItem={activeItem} 
        setActiveItem={setActiveItem}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        
        {/* Fixed Header */}
        <header className="fixed top-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200 transition-all duration-300"
                style={{ 
                  left: isCollapsed ? '64px' : '256px' 
                }}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800 capitalize">
                {activeItem.replace(/([A-Z])/g, ' $1').trim()}
              </h1>
            </div>
          </div>
        </header>

        {/* Content with proper spacing - scrollable outlet only */}
        <main className="flex-1 pt-[80px] pb-[80px] bg-gray-50 overflow-hidden">
          <div className="h-full overflow-auto">
            <div className="p-6">
              <Outlet/>
            </div>
          </div>
        </main>

        {/* Custom Admin Footer */}
        <footer className="fixed bottom-0 right-0 z-20 bg-white border-t border-gray-200 transition-all duration-300"
                style={{ 
                  left: isCollapsed ? '64px' : '256px',
                  height: '80px'
                }}>
          <div className="h-full px-6 py-4">
            <div className="flex items-center justify-between h-full">
              {/* Left side - Copyright */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">H</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    © 2025 Hotel Manage. All rights reserved.
                  </span>
                </div>
              </div>

              {/* Center - System Status */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">System Online</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Right side - Version & Support */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">Version 1.0.0</span>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                    Support
                  </button>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Made with</span>
                    <Heart className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-gray-500">for hotels</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayouts;
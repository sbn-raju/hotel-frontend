import React, { useState } from 'react';
import { Navigate, NavLink } from "react-router-dom";
import { 
  Home, 
  User, 
  Settings, 
  FileText, 
  BarChart3, 
  Mail, 
  Bell, 
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  ListOrdered,
  House,
  PackageOpen,
  ChartColumn,
  LucideFileCog,
  LayoutDashboardIcon
} from 'lucide-react';
import { secureFetch } from '../../../helpers/secureFetch';
import { useNavigate } from 'react-router-dom';

// Sidebar Component
export default function ModernSidebar({ activeItem, setActiveItem, isCollapsed, setIsCollapsed }) {
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();

  const menuItems = [
    { id: 'logs', to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
    { id: 'room', to: '/admin/room', label: 'Rooms', icon: Home },
    { id: 'orders', to: '/admin/orders', label: 'Orders', icon: PackageOpen },
    { id: 'customer', to: '/admin/customers', label: 'Customers', icon: User },
  ];

  const toggleMenu = (label) => {
    if (!isCollapsed) {
      setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
    }
  };


  //Handling the user logout//
  const handleLogout = async()=>{
    try {
      const response = await secureFetch("/auth/logout", {
        method: "POST",
      });
      const result = await response.json();

      if(result.success){
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col border-r border-gray-200`}>
        
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-gray-800">Manners Lodge</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {menuItems.map((link, index) => (
          <div key={index}>
            {!link.children ? (
              <NavItem
                to={link.to}
                icon={link.icon}
                label={link.label}
                isCollapsed={isCollapsed}
                setActiveItem={setActiveItem}
              />
            ) : (
              <div>
                <button
                  onClick={() => toggleMenu(link.label)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 
                    rounded-lg text-left transition-all duration-200
                    hover:bg-gray-50 group
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? link.label : ""}
                >
                  <div className="flex items-center gap-3" style={{ color: "#4d44b5" }}>
                    <link.icon size={isCollapsed ? 24 : 20} />
                    {!isCollapsed && <span className="truncate">{link.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <div className="flex-shrink-0">
                      {openMenus[link.label] ? (
                        <ChevronDown className="text-gray-500" size={18} />
                      ) : (
                        <ChevronRight className="text-gray-500" size={18} />
                      )}
                    </div>
                  )}
                </button>

                {!isCollapsed && openMenus[link.label] && (
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {link.children.map((child, i) => (
                      <NavLink
                        key={i}
                        to={child.to}
                        className={({ isActive }) =>
                          `block text-sm px-3 py-2 rounded-md transition-all duration-200 ${
                            isActive
                              ? "font-semibold shadow-sm"
                              : "hover:font-medium hover:bg-gray-50"
                          }`
                        }
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? "#dddef5" : "transparent",
                          color: isActive ? "#4d44b5" : "#6b7280",
                        })}
                        onClick={() => setActiveItem(child.label)}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4">
      
        {/* Logout Button */}
        <button 
          className={`
            flex items-center gap-2 text-red-600 hover:bg-red-50 
            w-full px-3 py-2 rounded-lg transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? "Logout" : ""}
          onClick={handleLogout}
        >
          <LogOut size={isCollapsed ? 24 : 20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, isCollapsed, setActiveItem }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
          isActive ? "font-semibold shadow-sm" : "hover:font-medium hover:bg-gray-50"
        } ${isCollapsed ? 'justify-center' : ''}`
      }
      style={({ isActive }) => ({
        backgroundColor: isActive ? "#dddef5" : "transparent",
        color: "#4d44b5",
      })}
      title={isCollapsed ? label : ""}
      onClick={() => setActiveItem(label)}
    >
      <Icon size={isCollapsed ? 24 : 20} />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
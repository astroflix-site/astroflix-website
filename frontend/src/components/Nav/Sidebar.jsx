import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="h-full bg-neutral-900 text-white flex flex-col p-4">
      {/* Sidebar Header */}
      <div className="text-2xl font-bold mb-6 text-center">
        Admin Panel
      </div>

      {/* Navigation Links */}
      <nav className="space-y-4">
        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-lg ${
              isActive ? 'bg-neutral-700 text-white' : 'text-neutral-300'
            } hover:bg-neutral-700 hover:text-white`
          }
        >
          Dashboard
        </NavLink>

        {/* Upload Anime */}
        <NavLink
          to="/admin/upload"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-lg ${
              isActive ? 'bg-neutral-700 text-white' : 'text-neutral-300'
            } hover:bg-neutral-700 hover:text-white`
          }
        >
          Upload Anime
        </NavLink>

        {/* Users */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-lg ${
              isActive ? 'bg-neutral-700 text-white' : 'text-neutral-300'
            } hover:bg-neutral-700 hover:text-white`
          }
        >
          Users
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;

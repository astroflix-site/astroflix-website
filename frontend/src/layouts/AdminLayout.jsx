import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../components/Nav/Sidebar';

function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar on the left */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6 bg-neutral-900 text-gray-200">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;

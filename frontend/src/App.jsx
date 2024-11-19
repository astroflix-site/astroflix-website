
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate  } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse'
import Bookmark from './pages/Bookmark'
import NoPage from './pages/NoPage'
import Register from './pages/Register'
import Login from './pages/Login'
import AnimeDetail from './pages/AnimeDetail'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './store/auth'
import { adminActions } from './store/admin'
import AdminLayout from './layouts/AdminLayout'
import AdminHome from './pages/admin/AdminHome'
import AdminUpload from './pages/admin/AdminUpload'
import AdminUsers from './pages/admin/AdminUsers'
import Profile from './pages/Profile'
import Notanadmin from './pages/admin/Notanadmin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'



function App({}) {
  const isAdmin = useSelector((state) => state.admin.isAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/check-cookie', { credentials: 'include' });
        const data = await response.json();
        if (data.message) {
          console.log("Welcome Back")
          dispatch(authActions.login());
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkAuth();
  }, [dispatch]);

  //check admin 
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Fetch user details with credentials included
        const response = await fetch('http://localhost:3000/api/user-details', {
          credentials: 'include', // Include cookies in request
        });
  
        // Check for HTTP errors
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
  
        if (data.user.role === "admin") {
          dispatch(adminActions.loginAdmin()); // Dispatch action to set admin role
        }
      } catch (error) {
        console.error('Error fetching admin role:', error.message);
      }
    };
  
    checkAdmin(); // Call the function when the component mounts
  }, [dispatch]);
  

  return (
    <>    <Router>
    <Routes>
      {/* Main Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<Browse />} />
        <Route path="bookmark" element={<Bookmark />} />
        <Route path="anime" element={<AnimeDetail />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Auth Layout */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Admin Layout */}
      {isAdmin ? (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="upload" element={<AdminUpload />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      ) : (
        <Route path="/admin/*" element={<Notanadmin/>} />
      )}

      {/* Catch-All Route */}
      <Route path="*" element={<NoPage />} />
    </Routes>
  </Router>
    </>
  )
}

export default App

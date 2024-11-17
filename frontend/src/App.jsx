
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse'
import Bookmark from './pages/Bookmark'
import NoPage from './pages/NoPage'
import Register from './pages/Register'
import Login from './pages/Login'
import AnimeDetail from './pages/AnimeDetail'
import { useDispatch } from 'react-redux'
import { authActions } from './store/auth'
import { adminActions } from './store/admin'
import AdminLayout from './layouts/AdminLayout'
import AdminHome from './pages/admin/AdminHome'
import AdminUpload from './pages/admin/AdminUpload'
import AdminUsers from './pages/admin/AdminUsers'
import Profile from './pages/Profile'



function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("this is Check auth")
      try {
        const response = await fetch('https://cbpsc3gn-3000.inc1.devtunnels.ms/api/check-cookie', { credentials: 'include' });
        const data = await response.json();
        if (data.message) {
          dispatch(authActions.login());
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkAuth();
  }, [dispatch]);
  useEffect(() => {
    const checkAdmin = async () => {
      console.log("check admin funbction runs")
      try {
        // Fetch with the token in Authorization header
        const response = await fetch('https://cbpsc3gn-3000.inc1.devtunnels.ms/api/admin-only', {credentials: 'include'});

        const data = await response.json();
        console.log('this is data',data); // To inspect the data returned

        if (data.message) {
          dispatch(adminActions.loginAdmin()); // Dispatch action to set admin role
        }
      } catch (error) {
        console.log('Error fetching role:', error);
      }
    };

    checkAdmin(); // Run the function when the component mounts
  }, [dispatch]);


  return (
    <>
        <Router>
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
        <Route path="/" element={<AuthLayout />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="upload" element={<AdminUpload />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Catch-All Route */}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App

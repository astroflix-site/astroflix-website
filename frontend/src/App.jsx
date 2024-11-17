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



function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/check-cookie', { credentials: 'include' });
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

  return (
    <>
        <Router>
      <Routes>
        <Route path="*" element={<NoPage />}></Route>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/browse" element={<Browse/>} />
          <Route path="/bookmark" element={<Bookmark/>} />
          <Route path="/anime" element={<AnimeDetail/>} />
        </Route>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App

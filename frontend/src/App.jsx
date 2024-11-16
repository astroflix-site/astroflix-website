import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Bookmark from './pages/Bookmark'
import NoPage from './pages/NoPage'
import Register from './pages/Register'
import Login from './pages/Login'
import AnimeDetail from './pages/AnimeDetail'
function App() {
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

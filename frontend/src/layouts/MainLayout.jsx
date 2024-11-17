import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Nav/Navbar'

const mainLayout = () => {
  return (
    <div className='relative'>
      {/* <Navbar/> */}
      <Outlet />
    </div>
  )
}

export default mainLayout
import React from 'react'
import { Link } from 'react-router-dom'

function Notanadmin() {
  return (
    <div className='bg-neutral-900 flex justify-center items-center min-h-screen min-w-full text-gray-300 text-xl flex-col py-8 '>
      <p>You don't have access to this page<br />Only Admins Can Access This Page</p>
      <button className='flex bg-neutral-800 text-lg px-4 py-2 shadow-lg rounded-md mt-4 '>
        <Link to="/">Back!</Link>
      </button>
    </div>
  )
}

export default Notanadmin

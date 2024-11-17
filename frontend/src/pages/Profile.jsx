import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
function Profile() {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const navigate = useNavigate();
    useEffect(() => {
      // Check if not logged in and redirect to login
      if (!isLoggedIn) {
        navigate('/login');
      }
    }, [isLoggedIn, navigate]); // Depend on isLoggedIn to check if user is logged in
  
  return (
    <div>
      Profile page yay
    </div>
  )
}

export default Profile

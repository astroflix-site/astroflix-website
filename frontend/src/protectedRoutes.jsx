import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // From Redux
  const user = useSelector((state) => state.auth.user); // Get user details from Redux
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if not logged in
      setLoading(false);
    } else if (user && user.role !== 'admin') {
      navigate('/notanadmin'); // Redirect to home if user is not an admin
      setLoading(false);
    } else {
      setLoading(false); // User is authorized, let them through
    }
  }, [isLoggedIn, user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children; // Render protected content if authorized
};

export default ProtectedRoute;

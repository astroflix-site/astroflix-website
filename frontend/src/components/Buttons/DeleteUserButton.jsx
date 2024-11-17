import React from 'react';

function DeleteUserButton({ userId }) {
  const handleDelete = async () => {
    try {
      // Get the JWT token from local storage or session storage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not authenticated!');
        return;
      }

      // Make the DELETE request to the API
      const response = await fetch(`http://localhost:3000/api/delete-user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Add token to headers
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle errors (e.g., insufficient permissions)
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      // Success response
      const data = await response.json();
      alert('User deleted successfully!');
      console.log(data.message);
    } catch (error) {
      // Error handling
      alert(`Error: ${error.message}`);
      console.error('Delete failed:', error);
    }
  };

  return (
    <button onClick={handleDelete} className="btn btn-danger bg-red-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-red-700 transition-all">
      Delete
    </button>
  );
}

export default DeleteUserButton;

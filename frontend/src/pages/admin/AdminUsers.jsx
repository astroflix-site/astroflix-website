import React, { useEffect, useState } from 'react';
import DeleteUserButton from '../../components/Buttons/DeleteUserButton';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]); // Initialize users as an empty array
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass token if required
          },
        });

        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        console.log(data); // To check the structure of the response

        // Check if the response contains a "users" property and it's an array
        if (data && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          throw new Error('Data is not in the expected format');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  // Function to delete user
  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/delete-user/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // If deletion was successful, remove the user from the state
      setUsers(users.filter((user) => user._id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  // Format date using toLocaleDateString
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-300 text-center mb-6">All Users</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {users && users.length > 0 ? (
        <div className="flex gap-6 mt-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-neutral-800 max-w-[18vw] min-w-[14vw] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <h3 className="text-gray-200">Username: {user.username}</h3>
              <p className="text-gray-300 mt-2">Email: {user.email}</p>
              <p className="text-gray-300 mt-1">Role: {user.role}</p>
              <p className="text-gray-300 mt-1">
                Created at: {formatDate(user.createdAt)}
              </p>
              <DeleteUserButton className='mt-2' />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">No users available or loading...</p>
      )}
    </div>
  );
};

export default AdminUsersPage;

// src/pages/Admin/AdminUsersPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthContext'; 
import { Link } from 'react-router-dom';
import { FiEye, FiTrash2, FiUsers, FiUserPlus } from 'react-icons/fi'; 
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';

const API_URL = 'http://localhost:4002'; // Your backend URL

const AdminUsersPage = () => {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0); 

    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) {
                setError('Authentication token not found. Please log in.');
                setLoading(false);
                return;
            }

            try {
                
                const usersResponse = await fetch(`${API_URL}/api/admin/users`, { 
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!usersResponse.ok) {
                    throw new Error(`Failed to fetch users: ${usersResponse.statusText}`);
                }
                const usersData = await usersResponse.json();
                setUsers(usersData);
                setTotalUsers(usersData.length); 

                setLoading(false);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }
        if (!token) {
            setError('Authentication token not found. Cannot delete user.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/users/${userId}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete user.');
            }

            setUsers(users.filter(user => user._id !== userId));
            setTotalUsers(prev => prev - 1); 
            alert('User deleted successfully!');
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(err.message);
            alert(`Error deleting user: ${err.message}`);
        }
    };

    if (loading) {
        return <div className="text-center py-8 bg-DarkGray">Loading users...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">Error: {error}</div>;
    }

    return (
        <>
        <AdminNavbar/>
        <div className="bg-DarkGray min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
            {/* Banner Section */}
            <div className="bg-LightGray text-Purple p-8 rounded-lg shadow-md mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Manage Users</h1>
                    <p className="text-lg opacity-90">Overview and management of all registered users on JobShop.</p>
                    <div className="mt-4 flex items-center space-x-4">
                        <span className="text-2xl font-semibold"><FiUsers className="inline-block mr-2" /> {totalUsers} Total Users</span>
                        
                    </div>
                </div>
                
            </div>

            {/* User Cards Section */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Users</h2>
            {users.length === 0 ? (
                <p className="text-center text-gray-600">No users found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {users.map((user) => (
                        <div key={user._id} className="bg-Beige rounded-lg shadow-md p-6 flex flex-col justify-between border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center mb-4">
                                <img
                                    src={user.profilePic ? `${API_URL}/${user.profilePic}` : "https://via.placeholder.com/60?text=User"} // Placeholder for users without profile pic
                                    alt={user.firstName}
                                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-purple-300"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900"> {user.firstName.toUpperCase()} {user.lastName.toUpperCase()} </h3>
                                    
                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4 text-sm">
                                User ID: <span className="font-mono text-xs text-gray-500">{user._id}</span>
                                
                            </p>
                             <div className="text-sm text-gray-600">
                                                <p><strong>Email:</strong> {user.email}</p>
                                                <p><strong>Location:</strong> {user.location}</p>
                                                
                                                {user.createdAt && (
                                                    <p><strong>Registered On:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                                                )}
                                            </div>
                            <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                                <Link
                                    to={`/admin/users/${user._id}`} // Link to a detailed user view page
                                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm"
                                >
                                    <FiEye className="mr-2" /> View
                                </Link>
                                <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-sm"
                                >
                                    <FiTrash2 className="mr-2" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div>
        <AdminFooter/>
        </>
    );
};

export default AdminUsersPage;
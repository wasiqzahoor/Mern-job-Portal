
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import AdminNavbar from './AdminNavbar'; // Correct path
import { FaArrowLeft, FaSpinner, FaBriefcase, FaBuilding } from 'react-icons/fa';

const UserDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:4002';

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            setLoading(true);
            try {
                
                const [userRes, appsRes] = await Promise.all([
                    fetch(`${API_URL}/api/admin/users/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_URL}/api/admin/users/${id}/applications`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (!userRes.ok) throw new Error('Failed to fetch user details');
                if (!appsRes.ok) throw new Error('Failed to fetch user applications');

                const userData = await userRes.json();
                const appsData = await appsRes.json();

                setUser(userData.user); // Assume response is { success: true, user: {...} }
                setApplications(appsData.applications || []);

            } catch (err) {
                setError(err.message || "Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id, token]);
    
   const getStatusColor = (status) => {
        const lowerCaseStatus = status ? status.toLowerCase() : '';
        switch (lowerCaseStatus) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'reviewed': return 'bg-blue-100 text-blue-800';
            case 'interviewed': return 'bg-purple-100 text-purple-800';
            case 'hired': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

     if (loading) {
        return <div className="flex justify-center items-center h-screen bg-DarkGray"><FaSpinner className="animate-spin text-indigo-500 text-4xl" /></div>;
    }

    if (error) {
        return <div className="text-center py-12 text-lg text-red-600">Error: {error}</div>;
    }

    if (!user) {
        return <div className="text-center py-12 text-lg text-gray-600">User not found.</div>;
    }

    return (
        <div className="bg-DarkGray min-h-screen">
            <AdminNavbar />
            <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                
                
                {/* --- User Details Card --- */}
                <div className="max-w-5xl mx-auto bg-LightGray shadow-md rounded-lg p-6">
                       
       
                       <div className="flex items-center mb-6">
                           <div className="p-1 rounded-full bg-blue-100 text-blue-600 mr-4">
  <img
    src={user.profilePic ? `${API_URL}/${user.profilePic}` : "https://via.placeholder.com/150?text=User"}
    alt={`${user.firstName} Logo`}
    className="w-16 h-16 object-cover rounded-full"
  />
</div>
                           <div>
                               <h1 className="text-3xl font-bold text-gray-900">{user.firstName.toUpperCase()} {user.lastName.toUpperCase()}</h1>
                               <p className="text-lg text-gray-600">User</p>
                           </div>
                       </div>
       
                       <hr className="my-6 border-gray-200" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Info : </h2>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                          
                           <div>
                               <p className="text-gray-500 font-semibold text-sm mb-1">Email:</p>
                               <p className="text-base">{user.email}</p>
                           </div>
                           <div>
                               <p className="text-gray-500 font-semibold text-sm mb-1">Skills:</p>
                               <p className="text-base">{user.skills}</p>
                           </div>
                           <div>
                               <p className="text-gray-500 font-semibold text-sm mb-1">Location:</p>
                               <p className="text-base">{user.location}</p>
                           </div>
                           {user.phone && (
                               <div>
                                   <p className="text-gray-500 font-semibold text-sm mb-1">Phone:</p>
                                   <p className="text-base">{user.phone}</p>
                               </div>
                           )}
                           
                           {user.createdAt && (
                               <div>
                                   <p className="text-gray-500 font-semibold text-sm mb-1">Registered On:</p>
                                   <p className="text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
                               </div>
                           )}
                           {user.updatedAt && (
                               <div>
                                   <p className="text-gray-500 font-semibold text-sm mb-1">Last Updated:</p>
                                   <p className="text-base">{new Date(user.updatedAt).toLocaleDateString()}</p>
                               </div>
                           )}
                       </div>
       
                       
       <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Bio : </h2>
                    <p className="text-gray-700 leading-relaxed">
                        {user.bio || 'No description available for this company.'}
                    </p>
                </div>
                      
       
                       
                   </div>

               
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Applications by {user.firstName} {user.lastName}</h2>
                    {applications.length > 0 ? (
                        <div className="space-y-6">
                            {applications.map((app) => (
                                <div key={app._id} className="bg-LightGray border rounded-lg shadow-sm p-5 transition-shadow hover:shadow-md">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={app.company?.logo ? `${API_URL}/${app.company.logo}` : `https://ui-avatars.com/api/?name=${app.company?.companyName}`}
                                                alt="Company Logo"
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold text-blue-700">{app.job?.jobTitle || 'N/A'}</h3>
                                                <p className="text-sm text-gray-600 flex items-center gap-2"><FaBuilding className="text-gray-400" /> {app.company?.companyName || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <span className={`mt-3 sm:mt-0 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                                        Applied on: {new Date(app.appliedDate).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-8 rounded-lg shadow-md text-gray-500">
                            This user has not applied for any jobs yet.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserDetailPage;
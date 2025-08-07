// DashboardNavbar.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLogOut, FiBell, FiMenu, FiX } from 'react-icons/fi'; 
import io from 'socket.io-client';
import { AuthContext } from "../AuthContext";
import Notification from "../components/Notification";
import axios from 'axios';

const DashboardNavbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);
    const navigate = useNavigate();

    const { token, user: company, logout } = useContext(AuthContext);

    const API_BASE_URL = "http://localhost:4002";
    const API_ROUTES_URL = `${API_BASE_URL}/api`;

    useEffect(() => {
        if (!token || !company?._id) return;

        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${API_ROUTES_URL}/notifications`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const fetchedNotifications = response.data.notifications || [];
                setNotifications(fetchedNotifications);
                setUnreadCount(fetchedNotifications.filter(n => !n.isRead).length);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();

        const socket = io(API_BASE_URL); 
        socket.emit('addUser', company._id);
        socket.on('getNotification', (newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => socket.disconnect();
    }, [token, company]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`${API_ROUTES_URL}/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => prev - 1);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await axios.delete(`${API_ROUTES_URL}/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.filter(n => n._id !== id));
            const deletedNotification = notifications.find(n => n._id === id);
            if (deletedNotification && !deletedNotification.isRead) {
                setUnreadCount(prev => prev - 1);
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const handleClearAllNotifications = async () => {
        try {
            await axios.delete(`${API_ROUTES_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error("Error clearing all notifications:", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        // Main nav ko 'relative' banayein taake mobile menu iske neeche aa sake
        <nav className="bg-Navbar shadow-sm px-4 sm:px-6 py-3 relative">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    <Link to="/company" className="flex items-center space-x-2">
                        <img src="/images/logo.png" alt="Jobshop Logo" className="w-10 h-10" />
                        <div className="hidden sm:block">
                            <h1 className="font-semibold text-lg">JobShop</h1>
                            <p className="text-sm text-gray-500 -mt-1">Hiring Portal</p>
                        </div>
                    </Link>
                    {/* Desktop Navigation Links */}
                    <ul className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
                        <li><Link to="/company" className="hover:text-purple-600">Home</Link></li>
                        <li><Link to="/company-jobs" className="hover:text-purple-600">Company Jobs</Link></li>
                        <li><Link to="/post-job" className="hover:text-purple-600">Post Jobs</Link></li>
                        <li><Link to="/applications" className="hover:text-purple-600">Applications</Link></li>
                    </ul>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {token && company ? (
                        <>
                            {/* Notification Bell */}
                            <div className="relative" ref={notificationRef}>
                                <button onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)} className="relative text-gray-600 hover:text-purple-600 p-2 rounded-full">
                                    <FiBell className="h-6 w-6" />
                                    {unreadCount > 0 && <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{unreadCount}</span>}
                                </button>
                                {notificationDropdownOpen && <Notification notifications={notifications} handleMarkAsRead={handleMarkAsRead} handleDeleteNotification={handleDeleteNotification} handleClearAllNotifications={handleClearAllNotifications} />}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <div onClick={() => setDropdownOpen(!dropdownOpen)} className="cursor-pointer flex items-center space-x-2 hover:bg-gray-50 p-1 sm:p-2 rounded-lg">
                                    <img src={company.logo ? `${API_BASE_URL}/${company.logo}` : `https://ui-avatars.com/api/?name=${company.companyName}&background=random`} alt="Company Logo" className="w-8 h-8 rounded-full object-cover border" />
                                    <div className="text-sm hidden lg:block">
                                        <p className="font-semibold">{company.companyName}</p>
                                        <p className="text-gray-400 text-xs">{company.email}</p>
                                    </div>
                                </div>
                                {dropdownOpen && (
                                    <div className="absolute top-14 right-0 w-56 bg-white shadow-lg rounded-md p-4 z-50 border">
                                        <ul className="text-sm space-y-2">
                                            <li onClick={() => { navigate("/company-profile"); setDropdownOpen(false); }} className="flex items-center space-x-2 cursor-pointer hover:text-purple-600"><FiUser /> <span>Company Profile</span></li>
                                        </ul>
                                        <div className="mt-3 pt-3 border-t"><div onClick={handleLogout} className="flex items-center space-x-2 text-red-500 cursor-pointer"><FiLogOut /> <span>Sign Out</span></div></div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Login</Link>
                    )}

                    {/* --- Mobile Menu Button --- */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-purple-600 p-2 rounded-full">
                            {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Mobile Menu --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-40 animate-fade-in-down">
                    <ul className="flex flex-col p-4 space-y-2 text-gray-700">
                        <li><Link to="/company" className="block p-2 rounded hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/company-jobs" className="block p-2 rounded hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Company Jobs</Link></li>
                        <li><Link to="/post-job" className="block p-2 rounded hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Post Jobs</Link></li>
                        <li><Link to="/applications" className="block p-2 rounded hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Applications</Link></li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default DashboardNavbar;
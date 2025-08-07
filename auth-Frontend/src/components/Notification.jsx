import React from 'react';


const Notification = ({ notifications, handleMarkAsRead, handleDeleteNotification, handleClearAllNotifications }) => {
    return (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">Notifications</h3>
                {notifications.length > 0 && (
                    <button
                        
                        onClick={handleClearAllNotifications}
                        className="text-xs text-red-500 hover:text-red-700"
                    >
                        Clear All
                    </button>
                )}
            </div>
            {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    No new notifications.
                </div>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {notifications.map(notification => (
                        <li
                            key={notification._id}
                            className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${!notification.isRead ? 'bg-indigo-50' : 'bg-white'}`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <p className={`text-xs ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                        {notification.message}
                                    </p>
                                    <span className="block text-xs text-gray-400 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {!notification.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification._id)}
                                            className="text-xs text-white bg-blue-500 px-2 py-1 rounded-full hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteNotification(notification._id)}
                                        className="text-red-500 hover:text-red-700 transition-colors duration-200 text-lg leading-none"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notification;
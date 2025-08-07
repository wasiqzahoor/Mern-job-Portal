// index.js (Your main server file)
const express = require("express");
const http = require('http');
const { Server } = require("socket.io");
const dotenv = require("dotenv").config(); // Load environment variables
const DatabaseConnect = require("./config/DatabaseConnect"); // Database connection
const cors = require("cors");
const path = require('path');

// Initialize Express app
const app = express();
// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.IO server and configure CORS
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Your frontend URL
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
});

// Connect to the database
DatabaseConnect();

// --- Middleware Configuration ---
const corsOptions = {
    origin: 'http://localhost:5173', // Explicitly allow your frontend origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); // Apply CORS middleware
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Socket.IO for Real-time Notifications ---
// Use a Map to store online users (userId -> socket.id) for efficient lookup
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // When a user logs in or initializes their socket connection, they send their userId
    socket.on('addUser', (userId) => {
        if (userId) {
            onlineUsers.set(userId.toString(), socket.id); // Store userId -> socket.id mapping
            console.log(`User ${userId} registered with socket ID: ${socket.id}`);
            // For debugging: show all currently online user IDs
            console.log('Current online users:', Array.from(onlineUsers.keys()));
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Remove user from the onlineUsers map when they disconnect
        let disconnectedUserId = null;
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                disconnectedUserId = userId;
                onlineUsers.delete(userId);
                break;
            }
        }
        if (disconnectedUserId) {
            console.log(`User ${disconnectedUserId} removed from online users.`);
        }
        console.log('Current online users:', Array.from(onlineUsers.keys()));
    });

    // Optional: Handle manual user removal (e.g., on logout)
    socket.on('removeUser', (userId) => {
        if (userId && onlineUsers.has(userId.toString())) {
            onlineUsers.delete(userId.toString());
            console.log(`User ${userId} manually removed.`);
        }
        console.log('Current online users:', Array.from(onlineUsers.keys()));
    });
});

// Make `io` (Socket.IO server) and `onlineUsers` Map accessible in Express request handlers
// Controllers can now access them via `req.app.get('io')` and `req.app.get('onlineUsers')`
app.set('io', io);
app.set('onlineUsers', onlineUsers); // Ensure this key is consistent ('onlineUsers' vs 'users')

// --- Import and Use Routes ---
// Import your API routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes"); // Make sure this path is correct
const applicationRoutes = require("./routes/applicationsRoute");
const notificationsRouter = require('./routes/notificationsRoute');
const companyRoutes = require('./routes/companyRoutes');
const statsRoutes = require('./routes/statsRoutes');// Stats route also uses app.set 'onlineUsers'
const adminCompanyRoutes = require('./routes/adminCompanyRoutes');
const adminUserRoutes = require('./routes/adminUserRoute');
const adminJobRoutes = require('./routes/adminJobRoute');
const adminRoutes = require('./routes/adminRoutes');
const adminApplicationRoutes = require('./routes/adminApplicationRoutes');
// Mount your API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes); // All routes defined in jobsRoute.js will be under /api/jobs
app.use("/api/applications", applicationRoutes);
app.use('/api/notifications', notificationsRouter);
app.use('/api/companies', companyRoutes);
app.use('/api/stats', statsRoutes);// Stats route, now correctly imported and used
console.log('=== MOUNTING ADMIN APPLICATION ROUTES ===');
app.use('/api/admin/applications', adminApplicationRoutes);
// --- ADMIN ROUTES (Fixed order and conflicts) ---
// Mount specific admin routes BEFORE general admin routes to avoid conflicts
app.use("/api/admin/users", adminUserRoutes); 
app.use('/api/admin/jobs', adminJobRoutes);
app.use('/api/admin/companies', adminCompanyRoutes); // Changed from '/api/admin' to be more specific
app.use('/api/admin', adminRoutes); // General admin routes (should come last)

// Basic route for testing server status
app.get("/", (req, res) => {
    res.send("JobShop API is running...");
});

// Health check route for monitoring online users
app.get("/api/health/online-users", (req, res) => {
    const onlineUsersMap = req.app.get('onlineUsers'); // Get the Map
    res.json({
        success: true,
        onlineUsersCount: onlineUsersMap.size,
        onlineUsers: Array.from(onlineUsersMap.keys()) // Convert Map keys to an array for JSON response
    });
});

// --- Centralized Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error('Error Stack:', err.stack); // Log the full error stack
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong on the server!',
    });
});

// Start the server
const Port = process.env.PORT || 4002; // Use PORT from .env or default to 4002
server.listen(Port, () => {
    console.log(`Server is running at port ${Port}`);
    console.log(`Socket.IO server is ready for connections`);
});
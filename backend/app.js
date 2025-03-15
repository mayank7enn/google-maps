const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const driverRoutes = require('./routes/driverRoutes');
const routeRoutes = require('./routes/routeRoutes');

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
    origin: "http://localhost:3000", // Allow requests from the frontend
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Allow requests from the frontend
        methods: ["GET", "POST"],
    },
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('updateLocation', (data) => {
        console.log('Received location update:', data);
        io.emit('locationUpdate', data); // Broadcast location updates
    });
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

// Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/routes', routeRoutes);

// Handle root request
app.get('/', (req, res) => {
    res.send('Welcome to the WebSocket Server!');
});

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
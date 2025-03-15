import { io } from 'socket.io-client';

const SocketUrl = process.env.REACT_APP_WEB_SOCKET_URL 
// Initialize the socket connection
const socket = io(SocketUrl, {
    autoConnect: true, // Automatically connect to the server
    reconnection: true, // Enable reconnection if the connection drops
    transports: ['websocket'], // Use WebSocket transport only
});

export default socket;
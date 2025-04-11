const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

// Configuración de la aplicación
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3000',
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Manejo de usuarios conectados
const connectedUsers = new Map();

// Socket.io
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('login', (username) => {
        if (username.trim()) {
            connectedUsers.set(socket.id, {
                username,
                id: socket.id
            });
            
            io.emit('userConnected', {
                username,
                id: socket.id,
                users: Array.from(connectedUsers.values())
            });
        }
    });

    socket.on('chatMessage', (message) => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            io.emit('message', {
                user: user.username,
                text: message,
                timestamp: new Date()
            });
        }
    });

    function handleDisconnection(socket, reason = 'disconnect') {
        const user = connectedUsers.get(socket.id);
        if (user) {
            connectedUsers.delete(socket.id);
            io.emit('userDisconnected', {
                username: user.username,
                id: socket.id,
                users: Array.from(connectedUsers.values()),
                timestamp: new Date()
            });
            console.log(`Usuario ${reason === 'logout' ? 'cerró sesión' : 'desconectado'}:`, user.username, '(ID:', socket.id, ')');
        }
    }
    socket.on('disconnect', () => {
        handleDisconnection(socket);
    });
    socket.on('logout', () => {
        handleDisconnection(socket, 'logout');
    });

    socket.on('error', (error) => {
        console.error('Error de Socket:', error);
        socket.emit('errorMessage', {
            message: 'Ha ocurrido un error en el servidor'
        });
    });
});

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV || 'desarrollo'}`);
});

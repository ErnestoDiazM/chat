const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const connectedUsers = new Map();

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

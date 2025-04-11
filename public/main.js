const socket = io();
let currentUser = '';
const loginForm = document.getElementById('loginForm');
const chatContainer = document.getElementById('chatContainer');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const userList = document.getElementById('userList');

function login() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        currentUser = username;
        socket.emit('login', username);
        loginForm.style.display = 'none';
        chatContainer.style.display = 'block';
    }
}

function logout() {
    if (currentUser) {
        socket.emit('logout');
        currentUser = '';
        chatContainer.style.display = 'none';
        loginForm.style.display = 'block';
        messagesDiv.innerHTML = '';
        userList.innerHTML = '';
        document.getElementById('username').value = '';
    }
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('chatMessage', message);
        messageInput.value = '';
    }
}

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function updateUserList(users) {
    userList.innerHTML = users.map(user => `
        <li class="user-list-item">
            <span class="online-indicator"></span>
            ${user.username}
        </li>
    `).join('');
}

socket.on('userConnected', (data) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'message received';
    messageElement.innerHTML = `
        <div class="alert alert-success">
            ${data.username} se ha unido al chat
        </div>
    `;
    messagesDiv.appendChild(messageElement);
    updateUserList(data.users);
});

socket.on('message', (data) => {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${data.user === currentUser ? 'sent' : 'received'}`;
    messageElement.innerHTML = `
        <strong>${data.user}:</strong>
        <p>${data.text}</p>
        <span class="timestamp">${new Date(data.timestamp).toLocaleTimeString()}</span>
    `;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('userDisconnected', (data) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'message received';
    messageElement.innerHTML = `
        <div class="alert alert-secondary">
            ${data.username} ha abandonado el chat
            <br>
            <small class="text-muted">${new Date(data.timestamp).toLocaleTimeString()}</small>
        </div>
    `;
    messagesDiv.appendChild(messageElement);
    updateUserList(data.users);
});

socket.on('errorMessage', (data) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'message received';
    messageElement.innerHTML = `
        <div class="alert alert-danger">
            Error: ${data.message}
        </div>
    `;
    messagesDiv.appendChild(messageElement);
});

window.addEventListener('beforeunload', () => {
    if (currentUser) {
        socket.emit('logout');
    }
});

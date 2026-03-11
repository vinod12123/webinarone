'use strict';

// Force websocket transport to match server configuration and avoid 400 Bad Request (polling)
const socket = io({
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
});

// Get roomId from current URL
const urlParams = new URLSearchParams(window.location.search);
let roomId = urlParams.get('room');

if (!roomId) {
    const pathParts = window.location.pathname.split('/');
    roomId = pathParts.filter(Boolean).pop(); // Get last non-empty part
}

if (roomId) {
    roomId = roomId.trim();
    console.log('Lobby: Waiting for room:', roomId);

    socket.on('connect', () => {
        console.log('Lobby: Socket connected', socket.id);
        socket.emit('lobbyJoin', { roomId });
    });

    socket.on('webinarStarted', (data) => {
        console.log('Lobby: Received webinarStarted event', data);
        if (data.roomId === roomId) {
            console.log('Lobby: Webinar started! Redirecting...');
            window.location.reload();
        }
    });

    socket.on('connect_error', (error) => {
        console.error('Lobby: Socket connection error', error);
    });

    // Fallback: Re-join lobby socket room every 10 seconds just in case
    setInterval(() => {
        if (socket.connected) {
            console.log('Lobby: Pulse check...');
            socket.emit('lobbyJoin', { roomId });
        }
    }, 10000);

    // Show join button after 15 seconds as a manual fallback
    setTimeout(() => {
        const cta = document.getElementById('cta');
        const joinBtn = document.getElementById('joinBtn');
        if (cta && joinBtn) {
            cta.style.display = 'block';
            joinBtn.onclick = () => window.location.reload();
        }
    }, 15000);
} else {
    console.error('Lobby: No roomId found in URL');
}

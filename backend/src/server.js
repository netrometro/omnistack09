const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://<db>:<pass>@clusters.wjxyg.mongodb.net/semana09?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connectedUsers = {};

io.on('connection', socket => {
    //console.log('Usuário conectado', socket.id);
    //console.log(socket.handshake.query);

    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;

    //setTimeout(() => {
    //    socket.emit('hello', 'world');
    //}, 4000);
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})

// A ordem importa
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

/*
app.get('/', (req, res) => {
    //return res.send('Hello World');
    return res.json({ idade : req.query.idade});
});

app.put('/:id', (req, res) => {
    return res.json({ id : req.params.id});
});

app.post('/', (req, res) => {
    return res.json(req.body);
});
*/

server.listen(3333);
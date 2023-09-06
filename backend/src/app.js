const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./apiRoutes');
const authRoutes = require('./authRoutes');

//accesses .env file for project
require('dotenv').config();

const app = express();
const PORT = 3001;

//socket.io setup
const http = require('http').Server(app);
const { Server } = require('socket.io');
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

io.on('connection', (socket) => {
    console.log(`${socket.id} user just connected`);

    socket.on('disconnect', () => {
    console.log('a user disconnected');
    });

    socket.on('message', (data) => {
        console.log(data);
        io.emit('messageResponse', data);
    });
});

//use routes in apiRoutes.js 
app.use('/api', apiRoutes);
//use routes in authRoutes.js
app.use('/auth', authRoutes);

//startup function
const start = async () => {
    try{
        //connect to Mongo DB
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/"
        );

        //start server
        http.listen(PORT, (error) => {
            if(!error) console.log(`Server running on port ${PORT}`);
            else console.log("Error occurred, server can't start", error);
        });
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
};

start();
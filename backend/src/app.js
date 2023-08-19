const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./apiRoutes');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

//use routes in apiRoutes.js 
app.use('/api', apiRoutes);

//startup function
const start = async () => {
    try{
        //connect to Mongo DB
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/"
        );

        //start server
        app.listen(PORT, (error) => {
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
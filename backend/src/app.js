const express = require('express');
const apiRoutes = require('./apiRoutes');

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

app.use('/api', apiRoutes);

app.listen(PORT, (error) => {
    if(!error){
        console.log(`Server running on port ${PORT}`);
    }
    else{
        console.log("Error occurred, server can't start", error);
    }
});
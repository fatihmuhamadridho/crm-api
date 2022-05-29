const express = require('express');
const app = express();
const port = process.env.PORT || 8000
const database = require('./database');

database.connectToServer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const customerRoute = require('./routes/customer');

app.use('/', customerRoute)

app.listen(port, function(){
    console.log('server is okay!')
})
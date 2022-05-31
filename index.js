const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000
const database = require('./database');
// const config = require('./config');
// const mongoose = require('mongoose');

database.connectToServer();
// config.connectToServer();

const corsOptions = {
    origin: 'http://localhost:3000',
    credential: true,
    optionSuccessStatus: 200
}
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const customerRoute = require('./routes/customer');

app.use("/", customerRoute)
// const schema = new mongoose.Schema({
//     fullName: String
// })

// const model = mongoose.model('customers', schema)
// const db = mongoose.connection;
// app.get("/customers", async(req, res) => {
//     res.status(200).send({ message: "berasil"})
// })

app.listen(port, function(){
    console.log('server is okay!')
})
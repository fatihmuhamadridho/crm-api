require('dotenv/config')
// const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');


mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

let dbConnection;

module.exports = {
    connectToServer: async function(callback) {
        const db = mongoose.connection
        db.on("error", (error) => console.log(error))
        db.once("open", () => console.log('Connected to Database MongoDB'))
        // const model = db.model('customers', mongoose.Schema({ fullName: String }))
        // console.log(db)
        const customer = await db.collection("customers")
        console.log(customer)
    },

    getDb: function() {
        return dbConnection
    }
}
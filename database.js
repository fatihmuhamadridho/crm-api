require('dotenv/config')
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

let dbConnection;

module.exports = {
    connectToServer: function(callback) {
        client.connect(function (err, db) {
            if (err || !db) {
                return err;
            }

            dbConnection = db.db("crm")
            console.log("Connected to MongoDB")

            return callback;
        })
    },

    getDb: function() {
        return dbConnection
    }
}
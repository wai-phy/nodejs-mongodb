const mongodb = require("mongodb");

const mongodbClient = mongodb.MongoClient;
const dotenv = require("dotenv");

dotenv.config();

let db;

const mongoDbConnect = () => {
  mongodbClient
    .connect(process.env.MONGODB_URL)
    .then((result) => {
      db = result.db();
      console.log("Connected to Mongodb Database");
    })
    .catch((err) => console.log(err));
};

const getDatabase = () => {
  if (db) {
    return db;
  }
  throw new Error("No database");
};

module.exports = { mongoDbConnect, getDatabase };

const mongoose = require("mongoose");

//will work with node@14
//const mongoURI = "mongodb://localhost:27017";

//will work with node@17 or above
const mongoURI = "mongodb://0.0.0.0:27017";

const connectToMongo = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongo successsfully");
  });
};

module.exports = connectToMongo;

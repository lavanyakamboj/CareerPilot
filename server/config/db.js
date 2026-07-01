const mongoose = require("mongoose");

const connectDB = async () => { //// connecton may take time so we made it asynchronous by async
  try {  // try because the connection may break
    const conn = await mongoose.connect(process.env.MONGO_URI);   // await se data base connect hone tk wat krega fr niche vli line pr jyega vrna direct chla jyega
        //process.env.MONGO_URI--  .env file se ye value uthata hai.
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);  // server ko stop krne ke liye use hoga agr data base cnnect nahi hua h
  }
};

module.exports = connectDB;
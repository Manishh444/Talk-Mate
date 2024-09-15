const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useFindAndModify:true
    });
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error = galti se mistake : ${err.message}`);
    process.exit();
  }
};

module.exports = connectDB;

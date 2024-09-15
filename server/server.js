const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require('./congif/db');
const { errorHandler, notFound } = require("./middleware/errorMiddleware");


//-----------Routes------------------------------
const userRoutes = require('./routes/userRoutes')

//-----------Data Base connection---------------
dotenv.config();
connectDB();

//-----------API Routes-------------------------
const app = express();
app.use(express.json())
app.use('/api/users', userRoutes)
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT
app.listen(PORT, console.log("server is listenin at port",PORT))
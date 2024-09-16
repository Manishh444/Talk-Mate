const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require('./congif/db');
const { errorHandler, notFound } = require("./middleware/errorMiddleware");


//-----------Routes------------------------------
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')

//-----------Data Base connection---------------
dotenv.config();
connectDB();

//-----------API Routes-------------------------
const app = express();
app.use(express.json())

//-----------user API route---------------------------
app.use('/api/users', userRoutes)

//-----------chat API route---------------------------

app.use('/api/chats', chatRoutes)
//-----------message API route---------------------------



app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT
app.listen(PORT, console.log("server is listenin at port",PORT))
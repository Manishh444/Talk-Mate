const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require('./congif/db');
const { errorHandler, notFound } = require("./middleware/errorMiddleware");


//-----------Routes------------------------------
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require("./routes/messageRoutes");


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
app.use("/api/messages", messageRoutes);



app.use(notFound);
app.use(errorHandler);


const Port = process.env.PORT
// app.listen(Port, console.log("server is listenin at port", Port));

// -----------SERVER SIDE SOCKET CONNECTION-----------------
const server = app.listen(Port, () => {
  console.log(`app is listening on ${Port}`);
});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
}); 
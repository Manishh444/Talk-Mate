const express = require('express');
const { chats } = require('./data/data');

const app = express();

app.get('/', (req, res)=>{
    res.send("hello users")
})

app.get('/api/chats', (req, res)=>{
    res.send(chats)
})
app.listen(5000, console.log("server is listenin at port 5000"))
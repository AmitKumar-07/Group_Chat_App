const express=require('express');
const path=require('path');
const app=express();
const http=require('http').createServer(app);
//port number for localhost as well as for deployment
const port=process.env.PORT || 8000;

// http.listen(port,()=>{
//     console.log('listening at port ${port}')
// })
//public static path 
const static_path=path.join(__dirname,"../public/");

app.use(express.static(static_path));

app.get("/",(req,res)=>{
    res.sendFile(__dirname + '../public/index.html')
})

// http.listen(port,()=>{
//     console.log('listening at port ${port}')
// })
// app.listen(port,()=>{
//     console.log('runing at port ${port}')
// })
//socket
const io = require('socket.io')(http)

const users = {};

io.on('connection', socket =>{
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})
http.listen(port,()=>{
    console.log('listening at port ${port}')
})
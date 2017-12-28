const express=require("express")
const path=require("path")
const socketio=require("socket.io")
const http=require("http")
const app=express()
const server=http.createServer(app)
const io=socketio(server)
let userSockets={}
const port=process.env.PORT || 1111
app.use("/",express.static(path.join(__dirname,"frontend")))
io.on("connection",(socket)=>{
    socket.emit("connected")
    console.log(socket.id)
    socket.on("login",(data)=>{
        userSockets[data.user]=socket.id
        console.log(userSockets)
    })
    socket.on("send_msg",(data)=>{
        if(data.message.startsWith("@")){
            user=data.message.split(":")[0].substr(1)
            io.to(userSockets[user]).emit("recv_msg",data)
        }else{
            socket.broadcast.emit("recv_msg",data)
        }
    })
})
server.listen(port,()=>{
    console.log("Server started")
})
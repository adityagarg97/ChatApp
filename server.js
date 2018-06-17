const express = require("express")
const path = require("path")
const socketio = require("socket.io")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = socketio(server)
let userSockets = {}
const port = process.env.PORT || 1111
app.use("/", express.static(path.join(__dirname, "frontend")))
io.on("connection", (socket) => {
    console.log("A user connected")
    console.log(socket.id)
    socket.on("disconnect",()=>{
        // console.log("Disconnected",socket.id)
        let user;
        let flag=false
        for (key in userSockets){
            if(userSockets.hasOwnProperty(key) && userSockets[key]==socket.id){
                user=key
                delete userSockets[key]
                flag=true
            }
        }
        if(flag){
            for(key in userSockets){
                io.to(userSockets[key]).emit("disconnected_user",({data:userSockets,user:user}))
            }
        }
        // console.log(userSockets)
    })
    socket.on("login", (data) => {
        if(userSockets[data.user]){
            socket.emit("same_user",{message:"Please enter a different Username"})
        }else{
            userSockets[data.user] = socket.id
            console.log(userSockets)
            socket.emit("success",{success:true})
            io.emit("user_connected",userSockets)
        }
    })

    socket.on("send_msg", (data) => {
        if (data.message.startsWith("@")) {
            user = data.message.split(":")[0].substr(1)
            io.to(userSockets[user]).emit("p_msg", data)
            io.to(socket.id).emit("my_msgp",data)
        } else {
            io.to(socket.id).emit("my_msg",data)
            socket.broadcast.emit("recv_msg", data)
        }
    })
})
server.listen(port, () => {
    console.log("Server started")
})
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
            io.emit("disconnected_user",({data:userSockets,user:user}))
        }
        // console.log(userSockets)
    })
    socket.on("login", (data) => {
        userSockets[data.user] = socket.id
        console.log(userSockets)
        io.emit("user_connected",userSockets)
    })

    socket.on("send_msg", (data) => {
        if (data.message.startsWith("@")) {
            user = data.message.split(":")[0].substr(1)
            io.to(userSockets[user]).emit("recv_msg", data)
            io.to(socket.id).emit("recv_msg",data)
        } else {
            io.emit("recv_msg", data)
        }
    })
})
server.listen(port, () => {
    console.log("Server started")
})
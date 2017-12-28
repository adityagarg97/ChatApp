 const socket=io()
 socket.on("connected",()=>{
     console.log("Connected! Socket ID: "+socket.id)
 })
 $(function(){
     let loginDiv=$("#login-div")
     let userVal=$("#user-Val")
     let userBtn=$("#user-btn")
     let chatDiv=$("#chat-div")
     let chatVal=$("#chat-Val")
     let chatBtn=$("#chat-btn")
     let msgList=$("#msg-list")
     let user1=""
     userBtn.click(function(){
         user1=userVal.val()
         socket.emit("login",{
             user:user1
         })
         loginDiv.hide()
         chatDiv.show()
     })
     chatBtn.click(function(){
         socket.emit("send_msg",{
             user:user1,
             message:chatVal.val()
         })
     })
     socket.on("recv_msg",function(data){
         msgList.append($("<li class='list-group-item list-group-item-success list-group-item-action block m-1 p-3'>"+ data.user+": "+ data.message+"</li>"))
     })
 })
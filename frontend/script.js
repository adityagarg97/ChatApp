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
     let userlist=$("#usr-list")
     let user1=""
     userBtn.click(function(){
         user1=userVal.val()
         if(user1==""){
             window.alert("Please enter a username")
         }else {
             socket.emit("login", {
                 user: user1
             })
             loginDiv.hide()
             chatDiv.show()
         }
     })
     chatBtn.click(function(){
         socket.emit("send_msg",{
             user:user1,
             message:chatVal.val()
         })
         chatVal.val("")
     })
     socket.on("user_connected",(users)=>{
         userlist.empty()
         for (key in users){
             userlist.append($("<li class='list-group-item list-group-item-primary list-group-item-action block m-1 text-center'>"+ key+"</li>"))
         }
     })
     socket.on("recv_msg",function(data){
         msgList.append($("<li class='list-group-item list-group-item-success list-group-item-action block m-1'><strong>"+ data.user+"</strong>: "+ data.message+"</li>"))
     })
     socket.on("disconnected_user",(dataobj)=>{
         userlist.empty()
         users=dataobj.data
         user=dataobj.user
         for (key in users){
             userlist.append($("<li class='list-group-item list-group-item-primary list-group-item-action block m-1 text-center'>"+ key+"</li>"))
         }
         window.alert(user+" disconnected")
     })
 })
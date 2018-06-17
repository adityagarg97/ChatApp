const socket=io()
 socket.on("connected",()=>{
     console.log("Connected! Socket ID: "+socket.id)
 })
 $(function(){
     particlesJS.load('particles-js', './particles.json', function() {
         console.log('callback - particles.js config loaded');
     });
     let loginDiv=$("#login-div")
     let userVal=$("#user-Val")
     let userBtn=$("#user-btn")
     let chatDiv=$("#chat-div")
     let chatVal=$("#chat-Val")
     let chatBtn=$("#chat-btn")
     let msgList=$("#msg-list")
     let userlist=$("#usr-list")
     let messagesList=$("#messagesList")
     let user1=""
     function scrolldown1(){
         messagesList.animate({scrollTop:messagesList.get(0).scrollHeight},500)
     }
     userBtn.click(function(){
         user1=userVal.val()
         if(user1==""){
             window.alert("Please enter a username")
         }else {
             socket.emit("login", {
                 user: user1
             })
         }
     })
     userVal.keypress((e)=>{
         if(e.keyCode==13){
             userBtn.click()
         }
     })
     chatVal.keypress((e)=>{
         if(e.keyCode==13){
             chatBtn.click();
         }
     })
     chatBtn.click(function(){
         socket.emit("send_msg",{
             user:user1,
             message:chatVal.val()
         })
         chatVal.val("")
         chatVal.focus()
     })
     socket.on("user_connected",(users)=>{
         userlist.empty()
         for (key in users){
             userlist.append($("<li class='list-group-item list-group-item list-group-item-action m-1 text-center' style='color: darkviolet;background-color: orange'>"+ key+"</li>"))
         }
     })
     socket.on("recv_msg",function(data){
         msgList.append($("<div class='row justify-content-begin'><li class='list-group-item list-group-item-success list-group-item-action col-8 col-xs-12 m-1'><strong>"+ data.user+"</strong>: "+ data.message+"</li></div>"))
         scrolldown1()
     })
     socket.on("p_msg",function(data){
         msgList.append($("<div class='row justify-content-begin'><li class='list-group-item list-group-item-warning list-group-item-action col-8 col-xs-12 m-1'><strong>"+ data.user+"</strong>: "+ data.message+"</li></div>"))
         scrolldown1()
     })
     socket.on("my_msg",function(data){
         msgList.append($("<div class='row justify-content-end'><li class='list-group-item list-group-item list-group-item-action col-8 col-xs-12 m-1 justify-content-end' style='background-color: lightskyblue;color: darkblue'><strong>"+ data.user+"</strong>: "+ data.message+"</li></div>"))
         scrolldown1()
     })
     socket.on("my_msgp",function(data){
         msgList.append($("<div class='row justify-content-end'><li class='list-group-item list-group-item-warning list-group-item-action col-8 col-xs-12 m-1 justify-content-end'><strong>"+ data.user+"</strong>: "+ data.message+"</li></div>"))
         scrolldown1()
     })
     socket.on("disconnected_user",(dataobj)=>{
         userlist.empty()
         users=dataobj.data
         user=dataobj.user
         for (key in users){
             userlist.append($("<li class='list-group-item list-group-item list-group-item-action m-1 text-center' style='color: darkviolet;background-color: orange'>"+ key+"</li>"))
         }
         window.alert(user+" disconnected")
     })
     socket.on("same_user",(data)=>{
         window.alert(data.message)
     })
     socket.on("success",(data)=>{
         loginDiv.hide()
         chatDiv.show()
         chatVal.focus()
     })
 })
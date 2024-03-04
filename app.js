const express = require("express")
const http = require("http")
const app = express()
const path = require("path")
const server = http.createServer(app)
const socketIO = require("socket.io")
let connections = []; //연결처리


const io = socketIO(server)


//서버의 시작 위치
app.use(express.static(path.join(__dirname,"src")))

//포트 지정
const PORT = process.env.PORT || 5000;

//LISTEN PORT 지정
server.listen(PORT,()=>{console.log(`server is running ${PORT}`)})



io.on("connection",(socket)=>{

    console.log("연결이 이루어 졌습니다.");
    
    socket.on("All",(data)=>{
      
      console.log('서버->클라이언트 socket.id',socket.id);     
      connections= connections.filter(conn=> conn.id!=socket.id );
      

      connections.push({
        profile:data.profileImageEl,
        nickname:data.name,
        id : socket.id
      });

      //
      console.log('connections',connections);
       

      //클라이언트에게 connection 정보전달
      io.emit("connections",connections);

      //클라이언트에게 메시지 전송
      io.emit("All",`${data.name}|${data.msg}|${data.files}|${data.profileImageEl}`)
      
    })

      // 클라이언트의 연결이 종료될 때
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);

      connections= connections.filter(conn=> conn.id==socket.id );


    });


})



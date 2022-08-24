require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users")
const Conversation = require("./routes/conversation")
const Message = require("./routes/message")


// database connection
connection();

// middlewares

app.use(express.json({limit: '50mb'}));
app.use(cors());

// routes
// app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/conversation", Conversation);
app.use("/api/message", Message);

//Socket IO

const port = process.env.PORT ;
const server=app.listen(port, console.log(`Listening on port ${port}...`));

const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });


let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};




io.on("connection",(socket)=>{
     //when ceonnect
  console.log("a user connected.");
  io.emit("welcome","hello Socket")
  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });


  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text, media }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
      media,
    });
  });

  //typing status
  socket.on("typing", (data)=>{
    io.emit("sendstatus" , data)
  })

   //when disconnect
   socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

})
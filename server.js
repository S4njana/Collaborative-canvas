const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.send("✅ Real-time Drawing Server Running");
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("cursor", (pos) => {
    socket.broadcast.emit("cursor", { id: socket.id, pos });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

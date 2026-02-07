import http from "http";
import { WebSocketServer } from "ws";

const server = http.createServer(); // Render'ın istediği HTTP server

const wss = new WebSocketServer({ server }); // WS HTTP server'a bağlanıyor

let rooms = {};

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "join") {
      if (!rooms[data.room]) rooms[data.room] = [];
      rooms[data.room].push(ws);
      ws.room = data.room;
    }

    if (data.type === "move") {
      rooms[ws.room]?.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on("close", () => {
    if (ws.room && rooms[ws.room]) {
      rooms[ws.room] = rooms[ws.room].filter((c) => c !== ws);
    }
  });
});

// Render burada portu veriyor
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("WebSocket server running on port " + PORT);
});

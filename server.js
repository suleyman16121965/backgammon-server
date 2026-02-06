import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: process.env.PORT || 3000 });

let rooms = {};

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "join") {
      if (!rooms[data.room]) rooms[data.room] = [];
      rooms[data.room].push(ws);
      ws.room = data.room;
    }

    if (data.type === "move") {
      rooms[ws.room].forEach((client) => {
        if (client !== ws) client.send(JSON.stringify(data));
      });
    }
  });

  ws.on("close", () => {
    if (ws.room && rooms[ws.room]) {
      rooms[ws.room] = rooms[ws.room].filter((c) => c !== ws);
    }
  });
});

console.log("Backgammon server running...");

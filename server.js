import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

let rooms = {};

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "join") {
      const room = data.room;

      if (!rooms[room]) rooms[room] = [];
      rooms[room].push(ws);

      rooms[room].forEach(client => {
        client.send(JSON.stringify({
          type: "players",
          count: rooms[room].length
        }));
      });
    }

    if (data.type === "move") {
      const room = data.room;

      rooms[room]?.forEach(client => {
        if (client !== ws) {
          client.send(JSON.stringify({
            type: "move",
            from: data.from,
            to: data.to
          }));
        }
      });
    }

    if (data.type === "dice") {
      const room = data.room;

      rooms[room]?.forEach(client => {
        if (client !== ws) {
          client.send(JSON.stringify({
            type: "dice",
            values: data.values
          }));
        }
      });
    }
  });

  ws.on("close", () => {
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(client => client !== ws);
    }
  });
});

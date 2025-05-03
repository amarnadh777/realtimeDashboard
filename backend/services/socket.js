let io;


function setupSocket(server) {
  const { Server } = require('socket.io');
  
  // Only set io if it hasn't been initialized
  if (io) {
    return io; // Return if io is already initialized
  }

  // Initialize socket.io with the server
  io = new Server(server, {
    cors: {
      origin: "*",  // Allows all origins (You may want to change this for security)
      methods: ["GET", "POST"],
    }
  });

  // Set up socket connection event
  io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);
    
    socket.on("sendMessage", (data) => {
      console.log("Received message: ", data);
      io.emit("receiveMessage", data); // Emit message to all clients
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
 

  return io; 
}


module.exports = { setupSocket };

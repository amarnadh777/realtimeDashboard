const express = require('express');
const app = express();
const db = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/DataRoutes");
const flowRotes = require ("./routes/flowRoutes"); 
const http = require("http");
const { setupSocket } = require("./services/socket");  

db();

const server = http.createServer(app);

 const io = setupSocket(server);
 app.set("socketio",io)



app.use(cors({
  origin: "*",
  credentials: true
}));

// Body parser middleware
app.use(express.json());

// Define routes
app.use("/auth", authRoutes);
app.use("/data", dataRoutes);
app.use("/flow",flowRotes );
 
// Start server on port 3000
server.listen(3000, () => {
  console.log("Server running on port 3000");
});

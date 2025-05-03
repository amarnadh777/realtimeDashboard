const { getIo } = require("../services/socket");

let simulatorRunning = false;
let intervel ;


const startSimulator = async(req,res) =>
    {
        try {
            if(simulatorRunning)
            {
                return res.status(400).json({message:"simulatior is already running "})
            }
            const io = req.app.get("socketio")
            simulatorRunning = true 
            intervel = setInterval(() =>
            {
               const simulatedData = {

                time : new Date(),
                airQuality: Math.floor(Math.random() * 1000) + 300,
                humidity: Math.floor(Math.random() * 50) + 30 
               }
               
               io.emit("data",simulatedData)
               console.log(simulatedData)
            },2000)
            res.status(200).json({ message: "Simulator started successfully" });
        } catch (error) {
            
        }
    }

    const stopSimulator = async(req,res) =>
        {
            try {

                if(!simulatorRunning)
                {
                    return res.status(400).json({message:"simulatior is already stoped "})
                }
                 simulatorRunning = false
                 clearInterval(intervel)
                 res.status(200).json({ message: "Simulator stopped successfully" });
            
            } catch (error) {
                
            }
        }



        const fetchHistory = async (req, res) => {
            try {

              const { range } = req.query;
          
              if (!range) {
                return res.status(400).json({ message: "Range query param is required" });
              }
          
             
              const dummyData = [
                { time: "2025-04-25T10:00:00Z", airQuality: 560, humidity: 42 },
                { time: "2025-04-26T10:00:00Z", airQuality: 590, humidity: 39 },
                { time: "2025-04-27T10:00:00Z", airQuality: 510, humidity: 45 },
                { time: "2025-04-28T10:00:00Z", airQuality: 600, humidity: 41 },
                { time: "2025-04-29T10:00:00Z", airQuality: 570, humidity: 38 },
                { time: "2025-04-30T10:00:00Z", airQuality: 620, humidity: 43 },
                { time: "2025-05-01T10:00:00Z", airQuality: 550, humidity: 40 },
                { time: "2025-05-02T10:00:00Z", airQuality: 580, humidity: 44 },
                { time: "2025-05-03T10:00:00Z", airQuality: 610, humidity: 42 }
              ];
          
              let resultData = [];
          
              if (range === "last-week") {
            
                resultData = dummyData.slice(-7);
              } else if (range === "last-month") {

                resultData = dummyData;
              } else {
                return res.status(400).json({ message: "Invalid range value" });
              }
          
              res.status(200).json({ data: resultData });
            } catch (error) {
              console.log(error);
              res.status(500).json({ message: "Something went wrong" });
            }
          }
    

        module.exports = {startSimulator,stopSimulator,fetchHistory }
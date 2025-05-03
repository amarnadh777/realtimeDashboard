import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Graphcard from '../components/Graphcard';
import socket from '../services/socket';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState([]); // Holds the data for the graphs
  const [selectedRange, setSelectedRange] = useState('real-time'); // Selected range (real-time or history)
  
  // Handle socket data
  useEffect(() => {
    socket.on("data", (msg) => {
      console.log("Received data from backend:", msg);
      const formattedMsg = formatMessage(msg);

      setData((prev) => {
        const updatedData = [...prev, formattedMsg];
        if (updatedData.length > 20) updatedData.shift(); // Limit to 20 items
        return updatedData;
      });
    });

    return () => {
      socket.off("data"); // Cleanup socket on component unmount
    };
  }, []);

  // Format the incoming socket message
  const formatMessage = (msg) => {
    return {
      ...msg,
      time: new Date(msg.time).toLocaleTimeString(),
    };
  };

  // Start the simulation (realtime data feed)
  const startSimulation = async () => {
    try {
      await axios.get("http://localhost:3000/data/start-simulator");
    } catch (error) {
      console.error("Error starting simulation:", error);
    }
  };

  // Stop the simulation
  const stopSimulation = async () => {
    try {
      await axios.get("http://localhost:3000/data/stop-simulator");
    } catch (error) {
      console.error("Error stopping simulation:", error);
    }
  };

  // Handle range change (real-time or historical data)
  const handleSelectedRangeChange = async (e) => {
    const selectedValue = e.target.value;
    setSelectedRange(selectedValue);
    console.log("Selected Range:", selectedValue);

    if (selectedValue === "real-time") {
      // No action needed for real-time — the socket will handle it
      return;
    }

    // Fetch historical data based on the selected range
    fetchHistoryData(selectedValue);
  };

  // Fetch historical data (last-week or last-month)
  const fetchHistoryData = async (range) => {
    try {
      const response = await axios.get(`http://localhost:3000/data/fetchHistory?range=${range}`);
      const fetchedData = response.data.data;

      // Format the fetched data (date only, month and day)
      const formattedData = fetchedData.map(item => ({
        ...item,
        time: new Date(item.time).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short"
        })
      }));

      // Update the state with the fetched data
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  return (
    <div className="bg-[#F9F9F9] h-screen overflow-auto">
      <Navbar />
      <div className="flex items-center flex-col gap-10 justify-center mt-10">
        {/* Line chart */}
        <Graphcard
          chartData={data}
          chartType="line"
          startSimulation={startSimulation}
          stopSimulation={stopSimulation}
          selectedRange={selectedRange}
          onSelectedRange={handleSelectedRangeChange}
          heading="Real time data of air quality index"
        />

        {/* Bar chart */}
        <Graphcard
          chartData={data}
          chartType="bar"
          yAxisKey = "humidity"
          startSimulation={startSimulation}
          stopSimulation={stopSimulation}
          selectedRange={selectedRange}
          onSelectedRange={handleSelectedRangeChange}
          heading={"Realtime data of humdity "}
        />
      </div>
    </div>
  );
}

export default Dashboard;

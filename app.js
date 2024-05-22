const express = require("express");
const axios = require("axios");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
var cors = require('cors')
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

app.use(cors())

app.use(express.static(path.join(__dirname, "public")));

app.get("/welcome", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "welcome.html"));
});

app.get("/seatCoordinates", async (req, res) => {
  const barcode = "qio%27zlfqcè";

  if (!barcode) {
    return res.status(400).json({ error: "Barcode parameter is required" });
  }

  try {
    const response = await axios.get(process.env.BASE_URL + "tickets", {
      headers: {
        Authorization: "Bearer " + process.env.API_KEY,
      },
      params: {
        barcode: barcode,
      },
    });

    console.log("--- RESPONSE ---");
    console.log(response.data);
    console.log("-----------------");

    const seatingCoordinates = {
      top: 50.0,
      left: 75.0,
    };

    // Inform clients to show welcome text with a value
    io.emit('showWelcome', 'test');

    res.json(seatingCoordinates);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Er is een fout opgetreden bij het ophalen van tickets.",
    });
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});

// const express = require("express");
// const router = require("./routes");
// const morgan = require("morgan");
// const cors = require("cors");

// const server = express();

// server.use(morgan("dev"));
// server.use(express.json());

// const corsOptions = {
//   origin: "http://localhost:5173", // Cambia esto según sea necesario para tu entorno de producción
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Permitir el envío de cookies con la solicitud
// };

// server.use(cors(corsOptions));

// server.use(router);

// server.listen(3001, () => {
//   console.log("Server is running on port 3001");
// });

// module.exports = server;

const express = require("express");
// import express from "express";
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");

const server = express();

server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

server.use(router);

module.exports = server;

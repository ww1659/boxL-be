const express = require("express");
const app = express();
const { apiRouter } = require("./routes/api-router");

app.use(express.json());

//ENDPOINTS
app.use("/api", apiRouter);

//ERRORS

module.exports = app;

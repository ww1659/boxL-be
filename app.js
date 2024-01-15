const express = require("express");
const app = express();
const { apiRouter } = require("./routes/api-router");
const {
  psqlErrors,
  customErrors,
  serverErrors,
  getNonExistentPathError,
} = require("./controllers/errors-controller");

app.use(express.json());

//ENDPOINTS
app.use("/api", apiRouter);

//ERRORS
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);
app.all("*", getNonExistentPathError);

module.exports = app;

const dbConnection = require("./db");
const express = require("express");

dbConnection();

const app = express();
const port = 3000;

//to send json content in request body , we have to use express.json()
app.use(express.json());

//Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

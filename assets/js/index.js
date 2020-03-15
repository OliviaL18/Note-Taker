//Dependecies
const express = require("express");
const path = require("path");

//Define a port to listen for incoming requests
const PORT = process.env.PORT || 3000;

//Handle data parsing
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../../notes.html"));
});

//Server is listening
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});





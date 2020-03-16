//Dependecies
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

//Define a port to listen for incoming requests
const PORT = process.env.PORT || 3000;

//Handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Variable to hold the notes (for now)
let notes = [];

//Routes
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  return res.json(notes);
});

//Create new note
app.post("/api/notes", function(req, res) {
  let newNote = req.body;
  console.log(newNote);
  notes.push(newNote);
  res.json(newNote);
});

//Server is listening
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});





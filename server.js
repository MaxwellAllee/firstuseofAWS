//setting up dependecies
require("dotenv").config();
const express = require("express");
 const app = express();
 const server= require('http').createServer(app);
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// Routes
require("./routes/htmlRoutes")(app)
  server.listen(PORT, function() {
    console.log(
      "==> 🌋  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });


module.exports = app;
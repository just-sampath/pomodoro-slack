// Required Imports
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const app = require("./app");

//Connecting to the database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the DB!"));

// Listening to the app
(async () => {
  await app.start(3000, () => console.log("Bot is running on port 3000"));
})();

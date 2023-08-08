// Required Imports
const { App } = require("@slack/bolt");
const taskController = require("./controllers/taskController");

// Initialize the app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.command("/add", taskController.addTask);
app.command("/delete", taskController.deleteTask);
app.command("/todo", taskController.listTasks);

// Exporting our app
module.exports = app;

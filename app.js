// Required Imports
const { App } = require("@slack/bolt");
const taskController = require("./controllers/taskController");
const timerController = require("./controllers/timerController");
const Task = require("./models/taskModel");

// Initialize the app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Commands
app.command("/add", taskController.addTask);
app.command("/delete", taskController.deleteTask);
app.command("/todo", taskController.listTasks);
app.command("/start", timerController.startTask);
app.command("/stop", timerController.stopTask);
app.command("/complete", timerController.completeTask);

// Actions
app.action(/^option_/i, async ({ ack, body, say }) => {
  await ack();
  const userId = body.user.id;
  const selectedOption = body.actions[0].action_id;
  const texts = body.actions[0].value.split(";");
  if (selectedOption === "option_2") {
    await say(`Continue working on ${texts[1]}`);
    return;
  }
  const task = await Task.findOne({ text: texts[0], userId });
  const oldTask = await Task.findOne({ text: texts[1], userId });
  oldTask.status = "stopped";
  task.status = "started";
  await oldTask.save();
  await task.save();
  try {
    await app.client.chat.delete({
      token: process.env.SLACK_BOT_TOKEN,
      channel: body.channel.id,
      ts: body.message.ts,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
  }
  await say(`Task "${task.text}" has been started.`);
  await ack("Task started!");
});

// Exporting our app
module.exports = app;

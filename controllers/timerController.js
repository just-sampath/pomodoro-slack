// Required Imports
const Task = require("../models/taskModel");
const { fetchMotivationalQuote, deleteMessage } = require("../utils/utils");

// Starting a task
module.exports.startTask = async ({ command, ack, say }) => {
  await ack();
  //console.log(command);
  const { text } = command;
  const userId = command.user_id;
  if (!text) {
    say("Please provide the task description after the `/start` command.");
    return;
  }
  try {
    const task = await Task.findOne({ text, userId });
    const startedTask = await Task.findOne({ status: "started", userId });
    if (!task) {
      say("The given task does not exist!");
      return;
    }
    if (task.status === "started") {
      say("The given task is already started!");
      return;
    }
    if (startedTask) {
      say({
        text: `Reminder: You are currently working on the task "${startedTask.text}". \nWhich do you want?`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Reminder: You are currently working on the task "${startedTask.text}". \nWhich do you want?`,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: task.text,
                },
                action_id: "option_1",
                value: task.text + ";" + startedTask.text,
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: startedTask.text,
                },
                action_id: "option_2",
                value: startedTask.text,
              },
            ],
          },
        ],
      });
      return;
    }
    task.status = "started";
    await task.save();
    await say(`Task "${task.text}" has been started.`);
    await ack("Task started!");
  } catch (err) {
    console.error("Error starting task:", error);
    await ack("An error occurred while starting the task.");
  }
};

// Stopping a task
module.exports.stopTask = async ({ command, ack, say }) => {
  await ack();
  const { text } = command;
  const userId = command.user_id;
  if (!text) {
    say("Please provide the task description after the `/stop` command.");
    return;
  }
  try {
    const task = await Task.findOne({ text, userId });
    if (!task) {
      say("The given task does not exist!");
      return;
    }
    if (task.status === "stopped") {
      say("The given task is already stopped!");
      return;
    }
    task.status = "stopped";
    await task.save();
    await say(`Task "${task.text}" has been stopped.`);
    await ack("Task stopped!");
  } catch (err) {
    console.error("Error stopping task:", error);
    await ack("An error occurred while stopping the task.");
  }
};

// Completing a task
module.exports.completeTask = async ({ command, ack, say }) => {
  await ack();
  const { text } = command;
  const userId = command.user_id;
  if (!text) {
    say("Please provide the task description after the `/complete` command.");
    return;
  }
  try {
    const task = await Task.findOne({ text, userId });
    if (!task) {
      say("The given task does not exist!");
      return;
    }
    if (task.status === "completed") {
      say("The given task is already completed!");
      return;
    }
    task.status = "completed";
    await task.save();
    await say(
      `Task "${task.text}" has been completed. Here's a motivational quote to keep you going:`
    );
    const motivationalQuote = await fetchMotivationalQuote();
    say(motivationalQuote);
    await ack("Task stopped!");
  } catch (err) {
    console.error("Error completing task:", error);
    await ack("An error occurred while completing the task.");
  }
};

// Choosing a task to start
module.exports.chooseTask = async ({ ack, body, say }) => {
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
};

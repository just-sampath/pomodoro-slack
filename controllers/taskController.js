// Required Imports
const Task = require("../models/taskModel");
const { formatList } = require("../utils/utils");

// Adding a new task
module.exports.addTask = async ({ command, ack, say }) => {
  await ack();

  const { text } = command;
  const userId = command.user_id;
  const status = "not started";

  if (!text) {
    say("Please provide the task description after the `/add` command.");
    return;
  }

  // Save the task to the database
  try {
    await Task.create({ text, status, userId });
    await say(`New task added: "${text}"!`);
    await ack(`New task added: "${text}" with status: ${status}`);
  } catch (error) {
    console.error("Error adding task:", error);
    await ack("An error occurred while adding the task.");
  }
};

// Delete a task
module.exports.deleteTask = async ({ command, ack, say }) => {
  // Acknowledge the command request
  await ack();

  const { text } = command;
  const userId = command.user_id;

  if (!text) {
    say("Please provide the task description after the `/delete` command.");
    return;
  }

  // Find the task with the provided description and delete it
  try {
    const deletedTask = await Task.findOneAndDelete({ text, userId });
    if (!deletedTask) {
      say(`Task "${text}" not found or already deleted.`);
      return;
    }

    say(`Task "${deletedTask.text}" has been deleted.`);
    await ack("Task deleted!");
  } catch (error) {
    console.error("Error deleting task:", error);
    await ack("An error occurred while deleting the task.");
  }
};

// List all tasks
module.exports.listTasks = async ({ command, ack, say }) => {
  // Acknowledge the command request
  await ack();

  const userId = command.user_id;
  // Find all tasks for the user
  try {
    const tasks = await Task.find({ userId });

    if (tasks.length === 0) {
      say("You have no tasks in your list.");
      return;
    }

    taskStatuses = [];

    const formattedTasks = tasks.map((task, index) => {
      let statusText = "";
      let statusEmoji = "";

      switch (task.status) {
        case "not started":
          statusText = "Not Started";
          statusEmoji = ":grey_question:";
          break;
        case "started":
          statusText = "Started";
          statusEmoji = ":arrow_right:";
          break;
        case "completed":
          statusText = "Completed";
          statusEmoji = ":white_check_mark:";
          break;
        case "stopped":
          statusText = "Stopped";
          statusEmoji = ":no_entry:";
          break;
        default:
          statusText = "Unknown";
          statusEmoji = ":question:";
      }

      const taskText =
        task.status === "completed" ? `~${task.text}~` : task.text;
      return `${index + 1}. *${taskText}* (${statusText}) ${statusEmoji}`;
    });
    await say({
      text: "Here are your tasks:",
      blocks: formattedTasks.map((task) => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: task,
        },
      })),
    });
    await ack("Tasks listed!");
  } catch (error) {
    console.error("Error listing tasks:", error);
    await ack("An error occurred while listing tasks.");
  }
};

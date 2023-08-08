// Required Imports
const Task = require("../models/taskModel");

// Adding a new task
module.exports.addTask = async ({ command, ack, say }) => {
  await ack();

  const { text } = command;
  const userId = command.user_id;
  const status = "not started"; // Set the default status to "not started"

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

    const formattedTasks = tasks.map((task, index) => {
      return `${index + 1}. ${task.text}`;
    });

    say(`Here are your tasks:\n${formattedTasks.join("\n")}`);
    await ack("Tasks listed!");
  } catch (error) {
    console.error("Error listing tasks:", error);
    await ack("An error occurred while listing tasks.");
  }
};

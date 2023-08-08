// Required Imports
const mongoose = require("mongoose");

// Task Schema
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  status: {
    type: String,
    enum: ["not started", "started", "completed", "completed"],
    default: "not started",
  },
  userId: { type: String, required: true },
});

// Task Model
const Task = mongoose.model("Tasks", taskSchema);

module.exports = Task;

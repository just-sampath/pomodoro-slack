# Pomodoro Slack Bot

The Pomodoro Slack Bot is a productivity tool that helps you manage your tasks using the Pomodoro technique while also providing motivational quotes.

## Features

- **Pomodoro Timer:** Get regular notifications every 25 minutes to take a break or update your task list.
- **Todo List Management:** Keep track of your tasks with commands to add, delete, and view tasks.
- **Start/Stop Timer:** Control the Pomodoro timer with the ability to start and stop it.
- **Complete Tasks:** Mark tasks as completed and receive follow-up prompts.

## Commands

To interact with the bot, use the following slash commands in your Slack workspace:

- `/todo`: View your current todo list.
- `/add [task]`: Add a new task to your todo list.
- `/delete [task]`: Delete a task from your todo list by specifying its index.
- `/start [task]`: Start the Pomodoro timer.
- `/stop [task]`: Stop the Pomodoro timer.
- `/complete [task]`: Mark a task as completed by specifying its index.

## Motivational Quotes

The bot also provides AI-powered motivational quotes to keep you motivated during work sessions.

## Getting Started

1. Clone this repository to your local machine.
2. Install the required dependencies using `npm install`.
3. Set up your Slack app and get the necessary tokens.
4. Update the configuration file with your tokens and other settings.
5. Run the bot using `npm start`.

## Configuration

Make sure to set up the configuration file to include your Slack app tokens and other settings in the `config.env` file.

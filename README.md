# FeynQuest VS Code Extension

A powerful and intuitive VS Code extension i have built that integrates OpenAI's GPT-3.5-turbo model to provide intelligent code suggestions based on user comments and context.

---

## Features

- Generates personalized code suggestions using OpenAI's API.
- Suggests code snippets based on contextual lines and user input.
- Inserts selected code snippets directly into the active editor.
- Supports seamless integration into any VS Code workflow.

---

## Requirements

Before running the extension, ensure you have the following:

- Node.js (v14.x or later) installed.
- A valid OpenAI API key.

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/username/feynquest-ext.git
Navigate to the project directory:

bash
Copy code
cd feynquest-ext
Install dependencies:

bash
Copy code
npm install
Create a .env file in the root directory and add your OpenAI API key:

env
Copy code
OPENAI_API_KEY=your-api-key-here
How to Run the Extension
Open the project folder in Visual Studio Code:

bash
Copy code
code .
Open the VS Code command palette (Ctrl+Shift+P or Cmd+Shift+P on Mac).

## Select Run Extension.

A new instance of VS Code will launch with the extension activated.

How to Test the Extension
In the launched VS Code instance, open or create a .js file.

Write a comment on a new line (e.g., // How to create a fetch request in JavaScript?).

Use the command palette (Ctrl+Shift+P or Cmd+Shift+P) and run the command:

## bash

Copy code
FeynQuest: Ask
Select a code suggestion from the provided list. The code snippet will be inserted under the cursor's current line.

## Commands

Command	Description
npm install	Install dependencies.
code .	Open the project in VS Code.
npm run build	Build the extension for production (optional).
FeynQuest: Ask	Trigger the extension in a VS Code editor.
Contributing
Feel free to contribute by:

## Forking the repository.
Submitting pull requests with bug fixes or new features.
License
This project is licensed under the MIT License. See the LICENSE file for details.



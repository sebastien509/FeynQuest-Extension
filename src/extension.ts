import * as vscode from 'vscode';  // Importing necessary VS Code API
import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from the .env file
import { OpenAI } from 'openai';  // Or use the specific OpenAI library you're using


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,  // Get the API key from environment variables
  });


// Function to fetch context text (previous lines) above the current cursor position
async function extensionLineSelection(editor: vscode.TextEditor, position: vscode.Position, numLines: number) {
    const startLine = Math.max(position.line - numLines, 0);  // Calculate the start line to fetch, ensuring it doesn't go below line 0
    const endLine = position.line;  // The end line is the current line where the cursor is positioned

    // Create a range to get text from the calculated start line to the current line
    const range = new vscode.Range(new vscode.Position(startLine, 0), new vscode.Position(endLine, 0));
    const contextText = editor.document.getText(range);  // Get the text content of the specified range

    return contextText;  // Return the fetched context (previous lines of code)
}

// This function is activated when the 'feynquest.ask' command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('feynquest.ask', async () => {
        const editor = vscode.window.activeTextEditor;  // Get the currently active text editor
        if (!editor) return; // Exit if there's no active editor
  
        const position = editor.selection.active;  // Get the current cursor position
  
        // Fetch the previous 8 lines above the current cursor position for context
        const contextText = await extensionLineSelection(editor, position, 8);
        
        // Fetch the text of the current line where the comment is located (e.g., "//?")
        const commentText = editor.document.lineAt(position.line).text;
        
        // Combine the fetched context (previous lines) and the comment text into one string
        const inputText = contextText + '\n' + commentText;  // Combine context and comment for better AI prediction
  
        // Trigger AI API to generate code suggestions (API integration to be implemented)
        const suggestions = await fetchCodeSuggestions(inputText);  
        
        // Show the generated code suggestions to the user
        showCodeSuggestions(suggestions);
    });
  
    context.subscriptions.push(disposable);  // Add the command to the context's subscriptions so it stays active
}

// Function to fetch code suggestions from an AI model (e.g., OpenAI's GPT-3)
async function fetchCodeSuggestions(commentText: string) {
    try {
        const response = await openai.completions.create({
            model: "gpt-3.5-turbo",  // Specify the AI model to use
            prompt: commentText,  // Pass the combined context and comment as the prompt
            max_tokens: 150,  // Limit the number of tokens for the response (adjust as needed)
            temperature: 0.5,  // Control the randomness of the AI's response
        });

        // Check if the response contains the expected structure
        if (response.choices && response.choices.length > 0) {
            // Return the generated suggestions as an array of strings (split by newline)
            return response.choices[0].text?.trim().split("\n") || [];
        } else {
            console.error("No choices in the response");
            return [];
        }
    } catch (error) {
        // If an error occurs during the API request, log it and return an empty array
        console.error("Error fetching AI response:", error);
        return [];
    }
}

// Function to display the fetched code suggestions to the user and allow selection
async function showCodeSuggestions(suggestions: string[]) {
    if (suggestions.length === 0) {
        vscode.window.showInformationMessage("No code suggestions available.");  // Show a message if no suggestions are returned
        return;
    }

    // Display the suggestions in a Quick Pick UI, allowing the user to choose one
    const selection = await vscode.window.showQuickPick(suggestions, {
        placeHolder: 'Select a code suggestion to insert',  // Placeholder text
    });
  
    if (selection) {
        const editor = vscode.window.activeTextEditor;  // Get the active text editor
        if (editor) {
            const position = editor.selection.active;  // Get the current cursor position
            editor.edit(editBuilder => {
                editBuilder.insert(position, selection);  // Insert the selected suggestion at the cursor position
            });
        }
    }
}

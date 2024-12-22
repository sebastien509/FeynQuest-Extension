const vscode = require('vscode');
const { OpenAI } = require('openai'); // Ensure this is the correct import for the package you're using
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,  // Access the API key from environment variables
});



// Function to fetch code suggestions from OpenAI
async function fetchCodeSuggestions(commentText, contextText) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('API key is missing!');
        return [];  // Return an empty array if API key is missing
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Ensure the model is correct
            messages: [
                { role: "system", content: " software engineering expert assistant" },
                { role: "user", content:  ` The task:\n${commentText}.     Current code in the file: \n${contextText}\n\n . 

                response fromat: 
                1-***- Code responses Only.- no intro sentence- do not repeat prompt - no texts responses 
                2- write an updated sets of codes without the errors and respond to the task. 
                3-identify coding error first in the "Current code" if there are errors or syntax errors in the ${contextText}, 
                4- Always add a comment at the end explaining the codes rendered and stating the changes if applicable` },
            ],
            max_tokens: 1000, // Allow for larger responses
            temperature: 0.7,
        });

        return response.choices ? [response.choices[0].message.content] : [];
    } catch (error) {
        console.error('Error fetching AI response:', error);
        return [];
    }
}

// Function to show code suggestions
// Function to show code suggestions
async function showCodeSuggestions(suggestions) {
    if (suggestions.length === 0) {
        vscode.window.showInformationMessage('No suggestions available from FEYNQUEST.');
        return;
    }

    // Clean up the suggestion by removing any unwanted JavaScript markdown syntax
    const cleanedSuggestions = suggestions.map(suggestion => {
        // Remove any leading or trailing '```javascript' and '```'
        return suggestion.replace(/^```javascript\s*/i, '').replace(/\s*```$/, '');
    });

    // Show the cleaned suggestions in a QuickPick UI
    const selection = await vscode.window.showQuickPick(cleanedSuggestions, {
        placeHolder: 'FEYNQUEST Suggestion',
    });

    if (selection) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = editor.selection.active; // Current cursor position
            const nextLinePosition = new vscode.Position(position.line + 1, 0); // Move to the next line

            editor.edit(editBuilder => {
                editBuilder.insert(nextLinePosition, selection + "\n"); // Insert the selected suggestion
            });
        }
    }
}


// Register the command in VS Code
function activate(context) {
    let disposable = vscode.commands.registerCommand('feynquest.ask', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return; // Exit if no active editor

        const position = editor.selection.active;
        const contextText = await getContextText(editor, position, 100); // Grab 12 lines above the current line for context
        const commentText = editor.document.lineAt(position.line).text; // Only take the current line (comment or code)

        // Send contextText and commentText to fetch code suggestions
        const suggestions = await fetchCodeSuggestions(commentText, contextText);
        showCodeSuggestions(suggestions);
    });

    context.subscriptions.push(disposable);
}

// Function to get context text from above the current line
async function getContextText(editor, position, numLines) {
    const startLine = Math.max(position.line - numLines, 0); // Ensure start doesn't go below 0
    const endLine = position.line;
    const range = new vscode.Range(new vscode.Position(startLine, 0), new vscode.Position(endLine, 0));
    return editor.document.getText(range);
}

function deactivate() {
    console.log("FEYNQUEST has been deactivated.");
}

module.exports = {
    activate, // Ensure your activate function is exported
    deactivate, // Add the deactivate function here
};

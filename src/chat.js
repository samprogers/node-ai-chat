
import {api} from './config.js';
import {markdown} from 'markdown';
import path from "path";
import { readFile } from 'fs/promises';

const __dirname = path.resolve();
const BASE_JSON_PATH = __dirname + '/../prompts/baking-mood/';

/**
 * reads specified json file from prompts dir and returns string
 * @param file
 * @returns {Promise<string>}
 */
async function readPromptJSON(file) {
    let filePath = BASE_JSON_PATH + '/' + file;
    let data = await readFile(filePath);
    return data.toString();
}

/**
 * gets response given user input
 * @param fileName
 * @param userPrompt
 * @returns {Promise<*|undefined>}
 */
export async function getUserChatResponse(fileName, userPrompt) {
    let promptString = await readPromptJSON('user-prompt.json');
    promptString = promptString.replace('{{PROMPT}}', userPrompt);

    let promptObject = JSON.parse(promptString);
    return getChatResponse(promptObject);
}

/**
 * gets response given custom prompt
 * @param fileName
 * @returns {Promise<*|undefined>}
 */
export async function getSystemChatResponse(fileName) {
    let promptString = await readPromptJSON(fileName);
    let promptObject = JSON.parse(promptString);
    return getChatResponse(promptObject);
}

/**
 * Given the prompt object send api request to chatgpt
 * @param promptObject
 * @returns {Promise<*>}
 */
async function getChatResponse(promptObject) {
    try {
        const response = await api.responses.create(promptObject);
        return markdown.toHTML(response.output_text);
    } catch (error) {
        console.error("Error calling ChatGPT API:", error.response ? error.response.data : error.message);
    }
}



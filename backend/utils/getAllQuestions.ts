import { readFile } from "fs";
import { MCQ } from "../types/app";
import { Categories, getQuestionFileLoc } from "./categories.js";

const getAllQuestions = async (category: Categories): Promise<Array<MCQ>> => {
    return new Promise((resolve,  reject) => {
        const parentDir: URL = new URL('../..', import.meta.url);
        const fileLoc: URL = new URL('files/questionBank.json', parentDir);

        readFile(getQuestionFileLoc(category),'utf-8', async(err, data) => {
            if(!err){ 
                const parsedData = await JSON.parse(data);
                resolve(parsedData);
                return;
            }
            reject(err);
        })
    })
}

export default getAllQuestions;


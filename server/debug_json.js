import fs from 'fs';

const content = fs.readFileSync('user_math_json.txt', 'utf8');
const jsonStart = content.indexOf('[');
const jsonEnd = content.lastIndexOf(']');

const jsonStr = content.substring(jsonStart, jsonEnd + 1);

console.log("JSON Length:", jsonStr.length);
console.log("Snippet around 142457:");
console.log(jsonStr.substring(142000, 143000));


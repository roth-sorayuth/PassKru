import fs from 'fs';

const text = fs.readFileSync('d:/passkru/PassKru/server/user_prompt_full.txt', 'utf8');
console.log('Text length:', text.length);

// Search for "questionID" or "questionId"
const regex = /"questionID"\s*:\s*(\d+)/gi;
let match;
let count = 0;
const foundIds = [];

while ((match = regex.exec(text)) !== null) {
  count++;
  foundIds.push(match[1]);
}

console.log(`Total question IDs matched: ${count}`);
console.log('IDs:', foundIds.join(', '));


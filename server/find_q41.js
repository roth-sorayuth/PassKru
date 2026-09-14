import fs from 'fs';

const text = fs.readFileSync('d:/passkru/PassKru/server/user_prompt_full.txt', 'utf8');

// Find "questionID": 41
const idx41 = text.indexOf('"questionID": 41');
console.log('Index of Q41:', idx41);
if (idx41 !== -1) {
  console.log('Snippet 200 chars before Q41:\n', text.substring(idx41 - 200, idx41 + 100));
}


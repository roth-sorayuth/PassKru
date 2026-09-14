import fs from 'fs';

const text = fs.readFileSync('d:/passkru/PassKru/server/user_prompt_full.txt', 'utf8');
const idx = text.indexOf('<truncated');
console.log('Truncated tag index:', idx);
if (idx !== -1) {
  console.log('Snippet around truncated tag:\n', text.substring(idx - 200, idx + 200));
}


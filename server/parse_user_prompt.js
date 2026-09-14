import fs from 'fs';

function extractQuestions() {
  let text = fs.readFileSync('d:/passkru/PassKru/server/user_prompt_full.txt', 'utf8');
  text = text.replace(/\[cite:\s*\d+\]/g, '');

  const questions = [];
  
  // Find all top-level array start positions where questionID is defined
  const regex = /\[\s*\{\s*"questionID"/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const startIdx = match.index;

    let depth = 0;
    let inString = false;
    let escape = false;
    let endIdx = -1;

    for (let i = startIdx; i < text.length; i++) {
      const char = text[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === '[') depth++;
        else if (char === ']') {
          depth--;
          if (depth === 0) {
            endIdx = i;
            break;
          }
        }
      }
    }

    if (endIdx !== -1) {
      const jsonStr = text.substring(startIdx, endIdx + 1);
      try {
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed)) {
          questions.push(...parsed);
          console.log(`Parsed array at pos ${startIdx}: ${parsed.length} questions.`);
        }
      } catch (err) {
        console.error(`Failed to parse array starting at ${startIdx}: ${err.message}`);
      }
    }
  }

  console.log(`Total questions extracted: ${questions.length}`);
  fs.writeFileSync('d:/passkru/PassKru/server/extracted_gk_all.json', JSON.stringify(questions, null, 2));
}

extractQuestions();


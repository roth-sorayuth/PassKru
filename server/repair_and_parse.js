import fs from 'fs';

function extractBlocks() {
  let text = fs.readFileSync('d:/passkru/PassKru/server/user_prompt_full.txt', 'utf8');
  text = text.replace(/\[cite:\s*\d+(?:,\s*\d+)*\]/g, '');

  const truncIdx = text.indexOf('<truncated');
  if (truncIdx !== -1) {
    text = text.substring(0, truncIdx);
  }

  const regex = /\[\s*\{\s*"questionID"/gi;
  const indices = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    indices.push(match.index);
  }

  const allQuestions = [];

  for (let i = 0; i < indices.length; i++) {
    const start = indices[i];
    const end = (i + 1 < indices.length) ? indices[i + 1] : text.length;
    let blockText = text.substring(start, end).trim();

    // Find the last ] in blockText before next start
    const lastBracket = blockText.lastIndexOf(']');
    if (lastBracket !== -1) {
      blockText = blockText.substring(0, lastBracket + 1);
    }

    try {
      const parsed = JSON.parse(blockText);
      console.log(`Block ${i + 1}: Parsed ${parsed.length} questions.`);
      allQuestions.push(...parsed);
    } catch (err) {
      console.log(`Block ${i + 1} parse error: ${err.message}. Trying auto-repair...`);
      // Repair missing brackets/braces at the end
      let rep = blockText;
      let countBraces = 0;
      let countBrackets = 0;
      let inStr = false;
      for (let j = 0; j < rep.length; j++) {
        if (rep[j] === '"' && (j === 0 || rep[j - 1] !== '\\')) inStr = !inStr;
        if (!inStr) {
          if (rep[j] === '{') countBraces++;
          if (rep[j] === '}') countBraces--;
          if (rep[j] === '[') countBrackets++;
          if (rep[j] === ']') countBrackets--;
        }
      }

      if (inStr) rep += '"';
      while (countBraces > 0) {
        rep += '}';
        countBraces--;
      }
      while (countBrackets > 0) {
        rep += ']';
        countBrackets--;
      }

      try {
        const parsedRep = JSON.parse(rep);
        console.log(`Block ${i + 1} Repaired! Parsed ${parsedRep.length} questions.`);
        allQuestions.push(...parsedRep);
      } catch (err2) {
        console.error(`Block ${i + 1} Repair failed: ${err2.message}`);
      }
    }
  }

  console.log(`\nTOTAL EXTRACTED QUESTIONS: ${allQuestions.length}`);
  fs.writeFileSync('d:/passkru/PassKru/server/all_gk_questions_final.json', JSON.stringify(allQuestions, null, 2));
}

extractBlocks();


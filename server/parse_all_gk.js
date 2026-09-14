import fs from 'fs';

function parseAllQuestions() {
  let text = fs.readFileSync('d:/passkru/PassKru/server/user_prompt_full.txt', 'utf8');

  // Strip [cite: X] and similar citations
  text = text.replace(/\[cite:\s*\d+\]/g, '');
  text = text.replace(/\[cite:\s*\d+(?:,\s*\d+)*\]/g, '');

  const blocks = text.split(/\]\s*\[/);
  console.log('Split blocks count:', blocks.length);

  const allQuestions = [];

  blocks.forEach((block, idx) => {
    let cleanStr = block.trim();
    if (!cleanStr.startsWith('[')) cleanStr = '[' + cleanStr;
    if (!cleanStr.endsWith(']')) cleanStr = cleanStr + ']';

    // Remove any user prompt wrapper tags if outside json
    const firstBracket = cleanStr.indexOf('[');
    const lastBracket = cleanStr.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      cleanStr = cleanStr.substring(firstBracket, lastBracket + 1);
    }

    try {
      const parsed = JSON.parse(cleanStr);
      if (Array.isArray(parsed)) {
        console.log(`Block ${idx + 1}: Parsed ${parsed.length} questions.`);
        allQuestions.push(...parsed);
      }
    } catch (e) {
      console.error(`Block ${idx + 1} parse error: ${e.message}`);
      // Let's debug position of error
      const posMatch = e.message.match(/position (\d+)/);
      if (posMatch) {
        const errPos = parseInt(posMatch[1]);
        console.log('Around error pos:\n', cleanStr.substring(Math.max(0, errPos - 50), Math.min(cleanStr.length, errPos + 50)));
      }
    }
  });

  console.log(`Total successfully parsed questions: ${allQuestions.length}`);
  fs.writeFileSync('d:/passkru/PassKru/server/all_parsed_gk_questions.json', JSON.stringify(allQuestions, null, 2));
}

parseAllQuestions();


import fs from 'fs';

const logFile = 'C:/Users/U-ser/.gemini/antigravity/brain/a812c987-f1b1-470b-8001-05e402a20838/.system_generated/logs/transcript_full.jsonl';

const lines = fs.readFileSync(logFile, 'utf8').split('\n');
console.log('Total transcript lines:', lines.length);

let promptIndex = 0;
for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT') {
      promptIndex++;
      const text = typeof obj.content === 'string' ? obj.content : JSON.stringify(obj.content);
      console.log(`Prompt #${promptIndex} (step ${obj.step_index}): length = ${text.length}`);
      if (text.includes('questionID') || text.includes('General Knowledge') || text.includes('ក្រមសីលធម៌') || text.includes('100+')) {
        fs.writeFileSync(`d:/passkru/PassKru/server/user_prompt_${promptIndex}_step_${obj.step_index}.txt`, text);
        console.log(` Saved user_prompt_${promptIndex}_step_${obj.step_index}.txt`);
      }
    }
  } catch (e) {}
}


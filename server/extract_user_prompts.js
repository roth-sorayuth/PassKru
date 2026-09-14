import fs from 'fs';
import path from 'path';

const logsDir = 'C:/Users/U-ser/.gemini/antigravity/brain/a812c987-f1b1-470b-8001-05e402a20838/.system_generated/logs/chunks/transcript_full';

if (fs.existsSync(logsDir)) {
  const files = fs.readdirSync(logsDir).filter(f => f.endsWith('.jsonl'));
  for (const file of files) {
    const lines = fs.readFileSync(path.join(logsDir, file), 'utf8').split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const obj = JSON.parse(line);
        if (obj.type === 'USER_INPUT') {
          console.log(`=== USER INPUT in ${file} (step ${obj.step_index}) ===`);
          const text = typeof obj.content === 'string' ? obj.content : JSON.stringify(obj.content);
          console.log(text.substring(0, 300) + '...');
          fs.writeFileSync(`d:/passkru/PassKru/server/user_input_step_${obj.step_index}.txt`, text);
        }
      } catch (e) {}
    }
  }
} else {
  console.log('Logs dir does not exist');
}


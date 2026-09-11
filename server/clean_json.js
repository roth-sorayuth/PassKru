import fs from 'fs';

const content = fs.readFileSync('user_math_json.txt', 'utf8');
const jsonStart = content.indexOf('[');

let lastValidJsonStr = '';
let parsedObjects = [];

// Find the last valid closing bracket
for (let i = content.length; i > jsonStart; i--) {
  if (content[i] === '}') {
    const candidate = content.substring(jsonStart, i + 1) + ']';
    try {
      parsedObjects = JSON.parse(candidate);
      lastValidJsonStr = candidate;
      console.log(`Successfully parsed candidate up to index ${i}, total items: ${parsedObjects.length}`);
      break;
    } catch (e) {
      // Keep trying previous '}'
    }
  }
}

if (parsedObjects.length > 0) {
  console.log("First question ID:", parsedObjects[0].questionID);
  console.log("Last question ID:", parsedObjects[parsedObjects.length - 1].questionID);
  fs.writeFileSync('clean_math_questions.json', JSON.stringify(parsedObjects, null, 2), 'utf8');
  console.log("Saved clean_math_questions.json!");
} else {
  console.error("Failed to parse valid JSON array!");
}


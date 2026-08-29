const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/sai mohit/.gemini/antigravity/brain/3f48e37b-2512-4302-b095-38b979fa554a/.system_generated/logs/transcript_full.jsonl'),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const data = JSON.parse(line);
    if (data.tool_calls) {
      for (const call of data.tool_calls) {
        if (call.name === 'run_command') {
          console.log(`[Step ${data.step_index}] CMD: ${call.args.CommandLine}`);
        }
      }
    }
  } catch (e) {}
});

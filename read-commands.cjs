const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/sai mohit/.gemini/antigravity/brain/3f48e37b-2512-4302-b095-38b979fa554a/.system_generated/logs/transcript.jsonl'),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const data = JSON.parse(line);
    // Look for tool_calls with run_command
    if (data.tool_calls) {
      for (const call of data.tool_calls) {
        if (call.name === 'run_command') {
          const cmd = call.args.CommandLine;
          if (cmd && (cmd.includes('alembic') || cmd.includes('seed') || cmd.includes('docker') || cmd.includes('postgres') || cmd.includes('uvicorn') || cmd.includes('8000') || cmd.includes('5432'))) {
            console.log(`[Step ${data.step_index}] CMD: ${cmd}`);
          }
        }
      }
    }
  } catch (e) {
    // Ignore invalid JSON
  }
});

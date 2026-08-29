const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix auth/submit buttons
    content = content.replace(/font-medium hover:opacity-90/g, 'font-semibold hover:opacity-90');
    
    // Fix h1 tags from font-bold to font-extrabold
    content = content.replace(/<h1([^>]+)font-bold([^>]*)>/g, '<h1$1font-extrabold$2>');
    
    // Fix 'Register' or 'Login' links in auth pages that look like buttons/links at the bottom
    content = content.replace(/className="text-\[hsl\(var\(--primary\)\)\] font-medium hover:underline"/g, 'className="text-[hsl(var(--primary))] font-semibold hover:underline"');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + filePath);
    }
  }
});

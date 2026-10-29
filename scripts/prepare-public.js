const fs = require('fs');
const path = require('path');

function copyDir(from, to) {
  fs.cpSync(from, to, { recursive: true });
  console.log(`copied ${from} -> ${to}`);
}

const root = path.join(__dirname, '..');
copyDir(path.join(root, 'static'), path.join(root, 'public', 'static'));
copyDir(path.join(root, 'demo'), path.join(root, 'public', 'demo'));

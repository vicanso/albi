const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../assets/version');
fs.writeFileSync(file, new Date().toISOString());

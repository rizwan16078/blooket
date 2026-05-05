/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const files = fs.readdirSync('public/packs');
console.log(`Found ${files.length} files.`);

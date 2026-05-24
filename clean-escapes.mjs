import fs from 'fs';
let c = fs.readFileSync('data/blog.tsx', 'utf8');
const before = c.length;
c = c.replace(/\\"/g, '"');
fs.writeFileSync('data/blog.tsx', c);
console.log(`Cleaned. Length: ${before} -> ${c.length}`);

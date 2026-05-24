import fs from 'fs';
const c = fs.readFileSync('data/blog.tsx', 'utf8');

// Split posts by slug entries
const postRegex = /\{\s*slug:\s*"([^"]+)"[\s\S]*?(?=\n\s*\{\s*slug:|\n\s*\];)/g;
const posts = [];
let m;
while ((m = postRegex.exec(c)) !== null) {
  posts.push({ slug: m[1], body: m[0] });
}

console.log('Slug'.padEnd(45), 'FAQs', 'Links', 'Sources', 'Words');
console.log('-'.repeat(80));

const issues = [];
posts.forEach(p => {
  const contentStart = p.body.indexOf('content:');
  const contentSec = contentStart >= 0 ? p.body.slice(contentStart) : p.body;
  
  // FAQs: count question patterns inside FAQ blocks
  const faqMatch = contentSec.match(/FAQ[\s\S]*$/);
  const faqSec = faqMatch ? faqMatch[0] : '';
  const faqs = (faqSec.match(/font-bold text-white">/g) || []).length;
  
  // Internal links
  const links = (contentSec.match(/<Link href="\//g) || []).length;
  
  // External sources
  const srcMatch = p.body.match(/sources:\s*\[([\s\S]*?)\]/);
  const sources = srcMatch ? (srcMatch[1].match(/href:/g) || []).length : 0;
  
  // Approximate word count - strip JSX
  const text = contentSec
    .replace(/className="[^"]*"/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/[\\\/"`]/g, '')
    .replace(/\s+/g, ' ');
  const words = text.split(' ').filter(w => w.length > 1).length;
  
  console.log(p.slug.padEnd(45), String(faqs).padEnd(4), String(links).padEnd(5), String(sources).padEnd(7), words);
  
  const fails = [];
  if (faqs < 4) fails.push(`FAQ:${faqs}`);
  if (links < 5) fails.push(`Links:${links}`);
  if (sources < 3) fails.push(`Sources:${sources}`);
  if (words < 350) fails.push(`Words:${words}`);
  if (fails.length) issues.push({ slug: p.slug, fails });
});

console.log('\n\nIssues:');
issues.forEach(i => console.log(`${i.slug}: ${i.fails.join(', ')}`));
console.log(`\nTotal posts: ${posts.length}, with issues: ${issues.length}`);

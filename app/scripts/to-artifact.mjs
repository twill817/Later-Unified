// Turns the single-file build (dist/index.html) into a page fragment for the hosted prototype link,
// which adds its own <html>, <head> and <body>.
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/<meta charset[^>]*>/, '')
  .replace(/<meta name="viewport"[^>]*>/, '')
  .replace(/<title>[\s\S]*?<\/title>/, '');
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
const out = `<title>Later One</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n${head.trim()}\n${body.trim()}\n`;
writeFileSync(new URL('../dist/later-one.html', import.meta.url), out);
console.log(`Wrote dist/later-one.html (${(out.length / 1024).toFixed(0)} KB)`);

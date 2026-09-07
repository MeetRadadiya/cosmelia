const fs = require('fs');
const spec = JSON.parse(fs.readFileSync('Fathershops Front APIs.openapi.json', 'utf8'));
const paths = spec.paths || {};
const methods = ['get','post','put','delete','patch'];
const endpoints = [];
for (const [path, ops] of Object.entries(paths)) {
  for (const method of methods) {
    if (ops[method]) {
      const tags = (ops[method].tags || ['untagged']).join(',');
      const summary = ops[method].summary || '';
      endpoints.push(`[${tags}] ${method.toUpperCase()} ${path} — ${summary}`);
    }
  }
}
endpoints.forEach(e => console.log(e));
console.log('\nTotal endpoints:', endpoints.length);

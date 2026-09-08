const fs = require('fs');
const s = fs.readFileSync('fathershops_live_product69.html', 'utf8');
const regex = /class="([^"]*fs-rv[^"]*)"/g;
const classes = new Set();
let match;
while ((match = regex.exec(s)) !== null) {
  classes.add(match[1]);
}
console.log('Classes found:', Array.from(classes));

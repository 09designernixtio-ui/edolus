const c = JSON.parse(require('fs').readFileSync('config.json','utf8'));
const urls = new Set();
for (const id in c.assets) {
  const f = c.assets[id].file;
  if (!f) continue;
  if (f.url) urls.add(f.url);
  if (f.variants) for (const v in f.variants) if (f.variants[v].url) urls.add(f.variants[v].url);
}
[...urls].forEach(u => console.log(u));

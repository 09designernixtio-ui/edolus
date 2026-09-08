/* Minimal static server for the local EDOLUS build. */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname, PORT = process.env.PORT || 5178;
const MIME = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.wasm':'application/wasm', '.glb':'model/gltf-binary', '.basis':'application/octet-stream',
  '.bin':'application/octet-stream', '.png':'image/png', '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml',
  '.ogg':'audio/ogg', '.mp3':'audio/mpeg', '.mp4':'video/mp4', '.wav':'audio/wav',
  '.txt':'text/plain; charset=utf-8',
};
http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    const filePath = path.join(ROOT, path.normalize(urlPath));
    if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.stat(filePath, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404); return res.end('Not found: ' + urlPath); }
      const ext = path.extname(filePath).toLowerCase();
      const type = MIME[ext] || 'application/octet-stream';
      const range = req.headers.range;
      if (range && (ext === '.mp4' || ext === '.ogg' || ext === '.mp3')) {
        const m = /bytes=(\d*)-(\d*)/.exec(range);
        let start = m && m[1] ? parseInt(m[1],10) : 0;
        let end = m && m[2] ? parseInt(m[2],10) : st.size - 1;
        if (isNaN(start)) start = 0;
        if (isNaN(end) || end >= st.size) end = st.size - 1;
        res.writeHead(206, {
          'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${st.size}`,
          'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1,
        });
        return fs.createReadStream(filePath, { start, end }).pipe(res);
      }
      res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size,
        'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
      fs.createReadStream(filePath).pipe(res);
    });
  } catch (e) { res.writeHead(500); res.end('Server error'); }
}).listen(PORT, () => console.log(`EDOLUS on http://localhost:${PORT}`));

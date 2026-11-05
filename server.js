const express = require('express');
const Unblocker = require('unblocker');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PREFIX = '/proxy/';
// Optional password. If set, visitors must log in (HTTP Basic Auth, any username).
const PASSWORD = process.env.PROXY_PASSWORD || '';

const app = express();

// --- Optional password protection -------------------------------------------
if (PASSWORD) {
  app.use((req, res, next) => {
    if (req.path === '/healthz') return next();
    const header = req.headers.authorization || '';
    const [scheme, encoded] = header.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString();
      const pass = decoded.slice(decoded.indexOf(':') + 1);
      if (pass === PASSWORD) return next();
    }
    res.set('WWW-Authenticate', 'Basic realm="proxy"');
    res.status(401).send('Authentication required');
  });
}

// --- Proxy -------------------------------------------------------------------
// unblocker rewrites links, cookies, redirects and scripts so that pages keep
// loading through the proxy as you click around.
const unblocker = new Unblocker({ prefix: PREFIX });
app.use(unblocker);

// Health check for Render
app.get('/healthz', (req, res) => res.send('ok'));

// "Go" form handler: /go?url=example.com -> /proxy/https://example.com
app.get('/go', (req, res) => {
  let url = String(req.query.url || '').trim();
  if (!url) return res.redirect('/');
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  res.redirect(PREFIX + url);
});

// Home page
app.use(express.static(path.join(__dirname, 'public')));

// Needed so websockets (used by some sites) are proxied too
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
}).on('upgrade', unblocker.onUpgrade);

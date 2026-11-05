# render-proxy

A small web proxy you can deploy to [Render](https://render.com) for free. Open the site, type a web address, and the page loads through the server. Links, cookies, redirects and websockets keep going through the proxy as you browse.

## Deploy to Render

1. Push this repo to GitHub.
2. In Render, click **New → Blueprint** and pick this repo. Render reads `render.yaml` and sets everything up.
   (Or **New → Web Service**: build command `npm install`, start command `npm start`.)
3. When asked for `PROXY_PASSWORD`, enter a password. **This is strongly recommended:** without it, anyone who finds your URL can use your proxy.
4. Open `https://<your-service>.onrender.com`. Log in with any username and your password.

## Run locally

```bash
npm install
PROXY_PASSWORD=secret npm start
```

Then open http://localhost:8080.

## Usage

- Home page: enter a URL and click **Go**.
- Direct link: `https://<your-service>.onrender.com/proxy/https://example.com`

## Notes

- This is a web proxy you use in the browser, not a system-wide HTTP/SOCKS proxy. Render only accepts normal web traffic, so a standard proxy you set in your OS or browser settings will not work there.
- Sites with heavy JavaScript or strict bot protection (Google sign-in, YouTube, Discord and similar) may not work fully.
- On Render's free plan, the service sleeps after about 15 minutes with no traffic. The first request after that takes around 30 to 60 seconds.

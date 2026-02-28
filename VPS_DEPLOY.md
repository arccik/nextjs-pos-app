# VPS Deployment Guide
### Next.js 14 + Socket.IO + Bun

Tested on Ubuntu 22.04 LTS (Hetzner / DigitalOcean / Linode).

---

## 1. Provision the Server

Minimum spec: **1 vCPU, 1 GB RAM, 20 GB SSD** (~$6/month on Hetzner CX11).

When creating the server, add your SSH public key so you can log in without a password.

```bash
ssh root@YOUR_SERVER_IP
```

---

## 2. Create a Non-Root User

Running as root is a security risk. Create a dedicated user instead.

```bash
adduser deploy
usermod -aG sudo deploy

# Copy your SSH key to the new user so you can log in as them
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy

# Switch to the new user for everything below
su - deploy
```

---

## 3. Install Dependencies

### System packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx certbot python3-certbot-nginx ufw
```

### Bun

```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc          # reload PATH
bun --version             # confirm install
```

### PM2 (process manager — keeps the app alive after crashes and reboots)

```bash
bun add -g pm2
```

---

## 4. Configure the Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'   # ports 80 and 443
sudo ufw enable
sudo ufw status
```

---

## 5. Clone and Build the App

```bash
cd /home/deploy
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git pos-app
cd pos-app

bun install
bun run build
```

---

## 6. Set Environment Variables

Create the production env file:

```bash
nano .env
```

Paste and fill in your values:

```env
DATABASE_URL=postgresql://...          # Neon connection string
NEXTAUTH_SECRET=your-secret-here       # generate: openssl rand -base64 32
NEXTAUTH_URL=https://yourdomain.com    # your actual domain, no trailing slash
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

Save with `Ctrl+O`, exit with `Ctrl+X`.

Restrict permissions so only the deploy user can read it:

```bash
chmod 600 .env
```

---

## 7. Fix Socket.IO CORS Before Deploying

In `server.ts`, change the CORS origin from the wildcard to your actual domain.
This prevents any website from connecting to your socket server.

Open the file:

```bash
nano server.ts
```

Find this block:

```ts
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
```

Change it to:

```ts
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
    credentials: true,
  },
});
```

Save and exit.

---

## 8. Start the App with PM2

```bash
# Start the app using the start script from package.json
pm2 start "bun run start" --name pos-app

# Save the process list so PM2 restores it after a reboot
pm2 save

# Generate and enable the startup script
pm2 startup
# PM2 will print a sudo command — copy and run it, e.g.:
# sudo env PATH=$PATH:/home/deploy/.bun/bin pm2 startup systemd -u deploy --hp /home/deploy
```

Useful PM2 commands:

```bash
pm2 status          # check if app is running
pm2 logs pos-app    # view live logs
pm2 restart pos-app # restart after code changes
pm2 stop pos-app    # stop the app
```

---

## 9. Configure Nginx as a Reverse Proxy

Nginx sits in front of your app, handles HTTPS, and forwards both HTTP and
WebSocket traffic to port 3000.

Create a new site config:

```bash
sudo nano /etc/nginx/sites-available/pos-app
```

Paste the following (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Certbot will automatically update this block with SSL after step 10
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # Required for WebSocket / Socket.IO upgrade
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Keep WebSocket connections alive (1 hour)
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```

Enable the site and test the config:

```bash
sudo ln -s /etc/nginx/sites-available/pos-app /etc/nginx/sites-enabled/
sudo nginx -t          # must say "syntax is ok"
sudo systemctl reload nginx
```

---

## 10. Add SSL with Let's Encrypt

Point your domain's A record to the server IP first, then wait a minute for DNS
to propagate before running this.

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will:
- Obtain a free SSL certificate
- Automatically update your Nginx config to listen on 443
- Set up auto-renewal (runs twice a day via systemd timer)

Test auto-renewal:

```bash
sudo certbot renew --dry-run
```

After this step your app is live at `https://yourdomain.com` and Socket.IO
runs over `wss://` automatically.

---

## 11. Verify WebSocket Is Working

Open your browser's devtools → Network tab → filter by `WS`.
You should see a WebSocket connection to `wss://yourdomain.com/socket.io/`.
Status should be `101 Switching Protocols`.

If it shows repeated polling (`/socket.io/?transport=polling`) instead of a
WebSocket upgrade, check that the `Upgrade` and `Connection` headers are in
your Nginx config and that Nginx was reloaded after the change.

---

## 12. Deploying Updates

Each time you push new code to the server:

```bash
cd /home/deploy/pos-app
git pull
bun install          # in case dependencies changed
bun run build
pm2 restart pos-app
```

For zero-downtime restarts use:

```bash
pm2 reload pos-app   # rolling restart, no dropped connections
```

---

## 13. Useful Checks

```bash
# Check app is listening on port 3000
ss -tlnp | grep 3000

# Check Nginx status
sudo systemctl status nginx

# Watch live app logs
pm2 logs pos-app --lines 50

# Check SSL certificate expiry
sudo certbot certificates

# Check firewall rules
sudo ufw status verbose
```

---

## Summary of What Each Piece Does

| Component | Role |
|-----------|------|
| **Bun** | Runs `server.ts` (Next.js + Socket.IO on one HTTP server) |
| **PM2** | Keeps the process alive, restarts on crash, survives reboots |
| **Nginx** | HTTPS termination, reverse proxy, WebSocket upgrade headers |
| **Certbot** | Free SSL certificate from Let's Encrypt, auto-renewed |
| **UFW** | Firewall — only SSH, HTTP, HTTPS allowed in |
| **Neon** | Hosted PostgreSQL — no database setup needed on the VPS |

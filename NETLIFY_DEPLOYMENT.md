# Netlify Deployment Guide - Verde Station Murals

## Prerequisites
- GitHub repository: `websitebutlers/verde-station-murals`
- Netlify account (free tier works fine)
- Mapbox API token

---

## Netlify Build Settings

### Basic Settings

**Build Command:**
```
next build
```

**Publish Directory:**
```
.next
```

**Node Version:**
```
20.18.0
```

---

## Environment Variables

You MUST add these environment variables in Netlify:

1. Go to **Site settings** → **Environment variables**
2. Add the following variable:

| Key | Value | Notes |
|-----|-------|-------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `your-mapbox-token-here` | Get from mapbox.com |

**Where to find your Mapbox token:**
- Go to https://account.mapbox.com/
- Navigate to "Access tokens"
- Copy your default public token (starts with `pk.`)
- Or create a new token with public scopes

---

## Detailed Netlify Setup Steps

### 1. Connect Repository

1. Log in to Netlify
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Select repository: `websitebutlers/verde-station-murals`
5. Click **"Deploy site"** (it will fail first time - that's OK!)

### 2. Configure Build Settings

Go to **Site settings** → **Build & deploy** → **Build settings**

Set these values:
- **Base directory:** (leave empty)
- **Build command:** `next build`
- **Publish directory:** `.next`
- **Functions directory:** (leave empty)

### 3. Add Environment Variables

Go to **Site settings** → **Environment variables** → **Add a variable**

Add:
```
Key: NEXT_PUBLIC_MAPBOX_TOKEN
Value: pk.your_actual_mapbox_token_here
```

Click **"Save"**

### 4. Configure Node Version (Optional but Recommended)

Create a file in your repo root called `netlify.toml`:

```toml
[build]
  command = "next build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20.18.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Or set in Netlify UI:
- Go to **Site settings** → **Environment variables**
- Add: `NODE_VERSION` = `20`

### 5. Trigger Deploy

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for build to complete (usually 2-3 minutes)

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Visit your site URL (e.g., `https://your-site-name.netlify.app`)
- [ ] Test the public map at `/map`
- [ ] Test the embed version at `/embed`
- [ ] Test the admin panel at `/admin`
- [ ] Click on mural markers to verify modals work
- [ ] Test the mural legend/list
- [ ] Verify images load correctly
- [ ] Test on mobile device

---

## Custom Domain (Optional)

To add a custom domain:

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `murals.verdestation.com`)
4. Follow DNS configuration instructions
5. Netlify will auto-provision SSL certificate

---

## Recommended Netlify Settings

### Deploy Contexts

**Production branch:** `main`

**Branch deploys:** Enabled (optional - for testing)

**Deploy previews:** Enabled (optional - for PR testing)

### Build Hooks (Optional)

Create a build hook if you want to trigger deploys via API:
1. Go to **Site settings** → **Build & deploy** → **Build hooks**
2. Click **"Add build hook"**
3. Name it (e.g., "Manual Deploy")
4. Save the webhook URL

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Solution: Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: "NEXT_PUBLIC_MAPBOX_TOKEN is not defined"**
- Solution: Add environment variable in Netlify settings
- Redeploy after adding

**Error: "Build exceeded maximum time"**
- Solution: Upgrade to paid Netlify plan or optimize build

### Site Loads but Map Doesn't Show

**Blank map or "Loading map..." forever**
- Check browser console for errors
- Verify Mapbox token is correct
- Verify token has public scopes enabled

**Images don't load**
- Check that `/public/assets` folder is in repository
- Verify image paths in `data/murals.json`

### Admin Panel Issues

**Can't access /admin**
- This is normal - Netlify serves it fine
- Just navigate to `https://yoursite.netlify.app/admin`
- Consider adding password protection (see below)

---

## Securing the Admin Panel (Recommended)

### Option 1: Netlify Identity (Free)

1. Go to **Site settings** → **Identity**
2. Click **"Enable Identity"**
3. Set **Registration** to "Invite only"
4. Add yourself as a user
5. Protect `/admin` route with Netlify Identity

### Option 2: Basic Auth (Paid Feature)

Requires Netlify Pro plan:
1. Add to `netlify.toml`:
```toml
[[redirects]]
  from = "/admin/*"
  to = "/admin/:splat"
  status = 200
  force = true
  conditions = {Role = ["admin"]}
```

### Option 3: Keep URL Secret

- Don't link to `/admin` publicly
- Only share URL with authorized users
- Change route name to something obscure (e.g., `/secret-admin-panel-xyz`)

---

## Performance Optimization

Netlify automatically provides:
- Global CDN
- Automatic HTTPS
- Image optimization (on paid plans)
- Brotli compression
- HTTP/2

Your site should load very fast!

---

## Monitoring

### Analytics (Optional)

Enable Netlify Analytics:
1. Go to **Analytics** tab
2. Enable analytics ($9/month)
3. View traffic, popular pages, etc.

### Deploy Notifications

Set up Slack/Email notifications:
1. Go to **Site settings** → **Build & deploy** → **Deploy notifications**
2. Add notification for deploy success/failure

---

## URLs After Deployment

Once deployed, your site will be available at:

- **Main site:** `https://your-site-name.netlify.app`
- **Public map:** `https://your-site-name.netlify.app/map`
- **Embed map:** `https://your-site-name.netlify.app/embed`
- **Admin panel:** `https://your-site-name.netlify.app/admin`

---

## Support

If you encounter issues:
1. Check Netlify deploy logs
2. Check browser console for errors
3. Verify environment variables are set
4. Try clearing Netlify cache and redeploying

**Clear cache and redeploy:**
- Go to **Deploys** → **Trigger deploy** → **Clear cache and deploy site**


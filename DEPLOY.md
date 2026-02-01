# Deployment Guide for GitHub Pages

## Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Wedding photo gallery"
   ```

2. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it (e.g., `wedding-gallery` or `shreesona-wedding`)
   - Keep it **Public** (required for free GitHub Pages)
   - Don't initialize with README (you already have one)
   - Click "Create repository"

3. **Push your code**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under "Source", select **main** branch
5. Click **Save**
6. Wait 1-2 minutes, then your site will be live at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```

## Step 3: Update Google Cloud Console

**IMPORTANT:** You must add your GitHub Pages URL to authorized origins!

1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. Add to **Authorized JavaScript origins**:
   ```
   https://YOUR_USERNAME.github.io
   ```
4. Click **Save**
5. Wait 5 minutes for changes to take effect

## Step 4: Test Your Live Site

1. Visit your GitHub Pages URL
2. Images should load automatically
3. If you get authorization errors, double-check Step 3

## Updating Your Site

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically update within 1-2 minutes.

## Security Notes

✅ **Safe to commit config.js** because:
- API keys are restricted by domain in Google Cloud Console
- CLIENT_ID is public by design (used in frontend JavaScript)
- FOLDER_ID is just an identifier

⚠️ **Never commit**:
- Client Secrets
- Private keys
- Access tokens

## Troubleshooting

### Images not loading on GitHub Pages

1. Check browser console (F12) for errors
2. Verify Google Cloud Console authorized origins
3. Ensure Google Drive folder is publicly shared
4. Clear browser cache and try again

### "Authorization required" message

- Add your GitHub Pages URL to authorized origins
- Wait 5-10 minutes after updating Google Cloud Console
- Clear browser cache

### 404 Error on GitHub Pages

- Make sure repository is Public
- Check that GitHub Pages is enabled in Settings
- Wait a few minutes for initial deployment

## Custom Domain (Optional)

If you want to use your own domain (e.g., `wedding.yourdomain.com`):

1. Add a `CNAME` file with your domain name
2. Update DNS records to point to GitHub Pages
3. Add custom domain in repository Settings > Pages
4. Add your custom domain to Google Cloud Console authorized origins

---

Enjoy your free wedding gallery! 🎉

# Wedding Photo Gallery

A lightweight, beautiful web application that displays images from a Google Drive folder. Perfect for wedding photos, events, or any image collection you want to share!

## Features

- 🖼️ Beautiful responsive grid gallery
- 🔍 Lightbox viewer with navigation
- 📱 Mobile-friendly design
- 🚀 Fast and lightweight (pure vanilla JS, no frameworks)
- 💰 **Free hosting** on GitHub Pages, Netlify, or Vercel
- 🔐 Supports both public and private Google Drive folders

## ⚠️ Important: Image Format Support

**Supported:** JPG, PNG, WEBP, GIF ✅  
**NOT Supported:** HEIC/HEIF (iPhone default format) ❌

**If you have iPhone photos in HEIC format, you MUST convert them to JPG first!**  
See [IMPORTANT.md](IMPORTANT.md) for detailed conversion instructions.

## Live Demo

Once deployed, your gallery will look stunning with:
- Gradient background
- Smooth animations
- Click to zoom
- Keyboard navigation (arrow keys)
- Responsive design for all devices

## Setup Instructions

### Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Google Drive API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

### Step 2: Create OAuth 2.0 Client ID

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Your wedding gallery name
   - Support email: Your email
   - Authorized domains: (leave empty for now)
   - Developer contact: Your email
4. Choose "Web application" as the application type
5. Add authorized JavaScript origins:
   - `http://localhost:8000` (for local testing)
   - Your deployment URL (e.g., `https://yourusername.github.io`)
6. Click "Create"
7. Copy the **Client ID** (you'll need this!)

### Step 3: Create API Key (Optional)

Only needed if your Google Drive folder is public:

1. In "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API Key
4. Click "Restrict Key" and limit to Google Drive API

### Step 4: Get Your Google Drive Folder ID

1. Open Google Drive and navigate to your photos folder
2. Right-click the folder and select "Share"
3. Set sharing to "Anyone with the link" (if you want public access)
4. Copy the folder URL, it looks like:
   ```
   https://drive.google.com/drive/folders/1ABcD2EfGHiJkLmNoPqRsTuVwXyZ
   ```
5. The Folder ID is the part after `/folders/`: `1ABcD2EfGHiJkLmNoPqRsTuVwXyZ`

### Step 5: Configure the Application

1. Copy `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```

2. Open `config.js` and fill in your values:
   ```javascript
   const GOOGLE_CONFIG = {
       CLIENT_ID: 'your-client-id.apps.googleusercontent.com',
       API_KEY: 'your-api-key', // Optional
       FOLDER_ID: 'your-folder-id-from-step-4'
   };
   ```

### Step 6: Test Locally

1. Start a local web server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # OR using Python 2
   python -m SimpleHTTPServer 8000
   
   # OR using Node.js (if you have npx)
   npx serve
   ```

2. Open your browser and go to `http://localhost:8000`
3. You should see your gallery!

## Deployment Options (All Free!)

### Option 1: GitHub Pages (Recommended)

1. Create a new GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

3. Go to repository Settings > Pages
4. Select "main" branch as source
5. Your site will be live at `https://yourusername.github.io/your-repo/`

**Important:** Don't forget to add your GitHub Pages URL to the authorized JavaScript origins in Google Cloud Console!

### Option 2: Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. Follow the prompts to create a new site
4. Add your Netlify URL to Google Cloud Console authorized origins

### Option 3: Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Add your Vercel URL to Google Cloud Console authorized origins

## Customization

### Change the Title and Theme

Edit `index.html`:
```html
<h1>Our Wedding Gallery</h1>
<p class="subtitle">Beautiful moments captured forever</p>
```

### Modify Colors

Edit `styles.css` to change the gradient background:
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adjust Gallery Grid

Change the column width in `styles.css`:
```css
.gallery {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
```

## Troubleshooting

### "Unable to load images" Error

- Check that your `config.js` has the correct values
- Verify your Google Drive folder ID is correct
- Ensure the folder is shared publicly or you've signed in with Google

### "Authorization required" Message

- Make sure your Client ID is correct
- Check that your current URL is in the authorized JavaScript origins
- Try clearing your browser cache

### Images not loading

- Verify the folder contains image files (JPG, PNG, GIF, etc.)
- Check the folder permissions in Google Drive
- Open browser console (F12) to see detailed error messages

## Security Notes

- The `config.js` file is in `.gitignore` to prevent accidentally committing your credentials
- For public repositories, consider using environment variables or Netlify/Vercel environment settings
- Your API key and Client ID are safe to expose on the frontend (they're restricted by domain)
- Never commit your `config.js` to a public repository

## Cost Breakdown

This application is designed to be **100% FREE**:

- ✅ Google Drive API: Free (1 billion requests/day quota)
- ✅ GitHub Pages: Free hosting
- ✅ Netlify Free Tier: 100GB bandwidth/month
- ✅ Vercel Free Tier: 100GB bandwidth/month
- ✅ No database needed
- ✅ No server costs

Perfect for personal projects, weddings, and small events!

## Tech Stack

- Pure HTML5, CSS3, JavaScript (ES6+)
- Google Drive API v3
- Google Sign-In (OAuth 2.0)
- No frameworks or build tools required
- Total size: ~15KB (before images)

## License

MIT License - Feel free to use this for your own projects!

## Support

If you encounter any issues, check the browser console for error messages. Most problems are related to:
1. Incorrect Google Cloud Console configuration
2. Missing authorized JavaScript origins
3. Wrong Folder ID

---

Made with ❤️ for sharing beautiful moments

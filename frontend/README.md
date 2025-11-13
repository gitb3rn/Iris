# Iris Frontend

Simple testing interface for the Iris URL classification service.

## Local Testing

1. Make sure the Iris backend is running:
   ```bash
   cd D:\Iris
   npm run dev
   ```

2. Open `index.html` in your browser:
   - Double-click the file, or
   - Right-click → Open with → Your browser

3. Ensure "Local" environment is selected

## Deploy to Netlify

### Option 1: Drag and Drop
1. Log in to [Netlify](https://app.netlify.com)
2. Drag the `frontend` folder onto the Netlify dashboard
3. Done!

### Option 2: Git Deploy
1. Create a new repository for the frontend
2. Push the `frontend` folder contents to the repository
3. Connect the repository to Netlify
4. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `/`

### Update Production Endpoint
After deploying Iris to Cloudflare Workers, update line 243 in `index.html`:

```javascript
currentEndpoint = 'https://iris.YOUR-SUBDOMAIN.workers.dev/classify';
```

Replace `YOUR-SUBDOMAIN` with your actual Cloudflare Workers URL.

## Features

- Environment toggle (local dev / production)
- Example URLs for quick testing
- Formatted JSON response viewer
- Copy response to clipboard
- Error handling
- Responsive design

## Brand Colours

- Deep Blue: #041c2c
- Core Blue: #085FA1
- White: #ffffff
- Light: #F2ECE7
- Green: #188838

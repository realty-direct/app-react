# Realty Direct Dashboard

This React application provides a dashboard for Realty Direct.

## GitHub Pages Deployment Instructions

To deploy this application to GitHub Pages, follow these steps:

### 1. Build the application

Run the deploy script which builds the app and creates a 404.html file for client-side routing:

```bash
npm run deploy
```

This script:
- Builds the application with proper base path configuration
- Creates a 404.html file that redirects to index.html (for SPA routing)

### 2. Deploy to GitHub Pages

#### Option 1: Manual Deployment

If you're deploying manually:

1. Push the `dist` folder contents to the `gh-pages` branch:

```bash
# If you're using gh-pages package
npx gh-pages -d dist

# Or manually with git
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages -f
git checkout main
```

#### Option 2: GitHub Actions Deployment

Create a GitHub workflow file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Build
        run: npm run deploy
        
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```

### 3. Configure GitHub Repository Settings

1. Go to your repository's Settings
2. Navigate to Pages section
3. Set the source to the gh-pages branch
4. Your site will be published at: https://realty-direct.github.io/app-react/

### Troubleshooting

If you encounter issues:

1. Make sure your vite.config.ts has the correct base path:
   ```js
   base: '/app-react/', // Must match repository name
   ```

2. Ensure the router is configured with the correct basename in main.tsx:
   ```js
   const basePath = import.meta.env.BASE_URL || '/app-react/';
   const router = createBrowserRouter([...], { basename: basePath });
   ```

3. Check that index.html references compiled JS file, not TSX:
   ```html
   <script type="module" src="./main.js"></script>
   ```

4. For 404 errors on routes, ensure the 404.html file is created and properly redirects to index.html

## Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

```bash
# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

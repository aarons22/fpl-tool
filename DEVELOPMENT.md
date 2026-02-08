# Development Guide

This guide covers local development and testing for the Firebase web app template.

## Prerequisites

- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- Java 21+ (required for Firebase emulators)

## Local Development

### Running the Emulators

The Firebase emulators allow you to test your app locally without deploying to the cloud:

```bash
# Start all emulators
firebase emulators:start

# Or start specific emulators only
firebase emulators:start --only hosting,functions
```

The emulators will start on:
- **Hosting**: http://localhost:5000
- **Functions**: http://localhost:5001
- **Firestore**: http://localhost:8080
- **Emulator UI**: http://localhost:4000

### Testing Cloud Functions Locally

Once emulators are running, you can test the Cloud Functions:

**Test helloWorld function:**
```bash
curl http://localhost:5001/fpl-tool-dfb38/us-central1/helloWorld
```

**Test getData function:**
```bash
curl -X POST http://localhost:5001/fpl-tool-dfb38/us-central1/getData \
  -H "Content-Type: application/json" \
  -d '{"name": "World"}'
```

### Making Changes

**Frontend Changes** (HTML, CSS, JS in `public/`):
1. Edit files in `public/` directory
2. Refresh browser (emulators auto-reload hosting)
3. Test functionality in browser

**Cloud Functions Changes** (`functions/index.js`):
1. Edit `functions/index.js`
2. Emulators will auto-reload functions
3. Test via cURL or browser

**Firestore Rules** (`firestore.rules`):
1. Edit `firestore.rules`
2. Restart emulators to apply changes

## Code Quality

### Linting

```bash
# Lint Cloud Functions
cd functions
npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```

### Code Style

- **JavaScript**: Follow Google JavaScript Style Guide
- **Formatting**: Use ESLint for consistency
- **Comments**: Add JSDoc comments for functions

## Testing

### Manual Testing Checklist

- [ ] App loads on localhost:5000
- [ ] PWA manifest is valid (check DevTools → Application)
- [ ] Service worker registers successfully
- [ ] Cloud Functions respond correctly
- [ ] No console errors

### Browser Testing

Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Deployment

### Via GitHub Actions (Recommended)

Push to main branch or create a pull request:
- **PRs**: Automatic preview deployment
- **Main branch**: Automatic production deployment

### Manual Deployment

```bash
# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

## Project Structure

```
.
├── public/              # Frontend files (HTML, CSS, JS)
│   ├── index.html       # Main HTML file
│   ├── app.js           # Frontend JavaScript
│   ├── styles.css       # Styles
│   ├── sw.js            # Service worker
│   └── manifest.json    # PWA manifest
├── functions/           # Cloud Functions
│   ├── index.js         # Functions code
│   ├── package.json     # Functions dependencies
│   └── .eslintrc.js     # ESLint configuration
├── .github/workflows/   # GitHub Actions workflows
├── firebase.json        # Firebase configuration
├── firestore.rules      # Firestore security rules
└── firestore.indexes.json # Firestore indexes
```

## Adding New Features

### Adding a New Cloud Function

1. Edit `functions/index.js`
2. Export the new function:
   ```javascript
   exports.myNewFunction = functions.https.onRequest((request, response) => {
     return cors(request, response, async () => {
       // Your code here
       return response.status(200).json({ message: 'Success!' });
     });
   });
   ```
3. Test locally with emulators
4. Deploy

### Adding a New Page

1. Create new HTML file in `public/`
2. Update service worker cache if needed
3. Test locally
4. Deploy

## Troubleshooting

### Emulators won't start

**Issue**: Java not found
**Solution**: Install Java 21+ from https://adoptium.net/

**Issue**: Port already in use
**Solution**: Stop other processes or change ports in `firebase.json`

### Functions not responding

**Issue**: CORS errors
**Solution**: Ensure `cors({origin: true})` is applied to all HTTP functions

**Issue**: Functions not reloading
**Solution**: Restart emulators

### PWA not installable

**Issue**: Manifest invalid
**Solution**: Check `public/manifest.json` format and ensure HTTPS (required for PWA)

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [ESLint Rules](https://eslint.org/docs/rules/)

## Getting Help

- Check existing issues in the repository
- Review Firebase documentation
- Ask questions in GitHub Discussions

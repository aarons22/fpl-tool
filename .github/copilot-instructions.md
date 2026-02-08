# GitHub Copilot Instructions for brewfellow

## Core Principles

### 1. No-Touch Repository Philosophy

**This is a no-touch repository. All changes must be deployable and testable via GitHub Actions.**

- ❌ **NEVER** require manual deployment steps
- ❌ **NEVER** add features that need local-only configuration
- ✅ **ALWAYS** ensure changes can be tested via GitHub Actions workflows
- ✅ **ALWAYS** use Firebase-native features that work in CI/CD
- ✅ **ALWAYS** document any new secrets/environment variables needed in GitHub Actions

**GitHub Actions Workflows:**

- `.github/workflows/firebase-deploy-prod.yml` - Production deployment (on merge to main)
- `.github/workflows/firebase-preview.yml` - Preview deployments (on PRs)
- `.github/workflows/firebase-preview-teardown.yml` - Cleanup preview channels

**Required GitHub Secrets:**

- `FIREBASE_TOKEN` - Firebase CI token for deployments
- `GEMINI_API_KEY` - Google Gemini API key for coffee information search

### 2. Firebase-First Architecture

**Keep infrastructure simple by leveraging Firebase services.**

- ✅ **ALWAYS** use Firebase services over custom infrastructure:
  - Firebase Hosting for static files
  - Cloud Functions for backend logic
  - Cloud Firestore for database
  - Firebase Authentication (when needed)
  - Firebase Storage (for images/files)
- ❌ **NEVER** introduce non-Firebase infrastructure (e.g., separate servers, databases)
- ❌ **NEVER** add complex build processes or toolchains
- ✅ **PREFER** simple, vanilla JavaScript over complex frameworks
- ✅ **PREFER** Firebase SDK features over custom implementations

**Firebase Project:** `brewfellow-9496f` (us-central1)

## Documentation Guide

- **README.md** - Human setup guide
- **FUNCTIONS.md** - API reference (MUST update when changing functions)
- **copilot-instructions.md** - AI development workflow (this file)
- **MEMORY.md** - Architecture decisions and evaluation results

## Development Guidelines

### Making Code Changes

1. **Frontend Changes** (`public/` directory):
   - Use vanilla JavaScript (no build step required)
   - Follow mobile-first responsive design
   - Maintain offline-first PWA capabilities
   - Keep dependencies loaded from CDN (Firebase SDK, etc.)
   - Test on both desktop and mobile viewports

2. **Backend Changes** (`functions/` directory):
   - Node.js 20 runtime
   - Use `firebase-functions` v4.5.0 or higher
   - Use `firebase-admin` v12.0.0 or higher
   - Follow Google Cloud Functions best practices
   - Keep functions small and focused
   - Use CORS for web requests
   - **⚠️ ALWAYS update `FUNCTIONS.md` when adding or modifying functions**

3. **Database Changes** (`firestore.rules`, collections):
   - Update `firestore.rules` for security
   - Document collection schemas in code comments
   - **Update collection schemas in `FUNCTIONS.md` if modified**
   - Use server timestamps for `createdAt` fields
   - Keep queries simple (avoid complex indexes)

### Code Style

- **JavaScript**:
  - Google JavaScript Style Guide
  - Use ESLint (configured in `functions/.eslintrc.js`)
  - Prefer `const` over `let`, avoid `var`
  - Use async/await over Promise chains
  - Add JSDoc comments for functions
- **CSS**:
  - Mobile-first approach
  - Use CSS variables for theming
  - Keep selectors simple and semantic
  - Avoid overly specific selectors

- **Git Commits**:
  - Use clear, descriptive commit messages
  - Keep commits focused and atomic
  - Reference issue numbers when applicable

### Testing and Validation

**CRITICAL: All changes MUST be tested with emulators before pushing.**

#### 1. Start the Emulator Suite

```bash
firebase emulators:start
```

This starts:

- **Functions:** http://localhost:5001/brewfellow-9496f/us-central1
- **Firestore:** http://localhost:8080
- **Hosting:** http://localhost:5000
- **Emulator UI:** http://localhost:4000

#### 2. Test Cloud Functions

After making changes to `functions/index.js`, test each function:

**Test generateRecipe:**

```bash
curl -X POST http://localhost:5001/brewfellow-9496f/us-central1/generateRecipe \
  -H "Content-Type: application/json" \
  -d '{"coffeeName": "Ethiopian Yirgacheffe"}'
```

**Test getSeedRecipes:**

```bash
curl http://localhost:5001/brewfellow-9496f/us-central1/getSeedRecipes
```

**Test addSeedRecipe:**

```bash
curl -X POST http://localhost:5001/brewfellow-9496f/us-central1/addSeedRecipe \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Recipe",
    "coffee": "60g",
    "water": "900ml",
    "ratio": "1:15",
    "grindSize": "medium",
    "temp": 200,
    "bloom": {"ratio": "1:2", "time": 30, "temp": 205},
    "pulses": [{"temp": 200, "duration": 30}],
    "source": "Test"
  }'
```

#### 3. Verify Changes

- ✅ Check terminal logs for errors
- ✅ Open http://localhost:4000 to see Emulator UI
- ✅ Verify Firestore data in Emulator UI → Firestore tab
- ✅ Check function execution logs in Emulator UI → Logs tab
- ✅ Test frontend by opening http://localhost:5000

#### 4. Lint Code (Cloud Functions)

```bash
cd functions
npm run lint
```

Fix any linting errors before committing.

#### 5. Verify GitHub Actions

After pushing:

- Check workflow runs in GitHub Actions tab
- Test preview deployments on PRs
- Ensure no deployment errors

**Remember:** Emulator testing is REQUIRED. If it doesn't work in the emulator, it won't work in production.

### Adding Dependencies

**Frontend** (`public/`):

- ✅ Use CDN imports (Firebase SDK, etc.)
- ❌ Avoid npm packages requiring build steps
- Keep it simple - vanilla JS preferred

**Backend** (`functions/package.json`):

- ✅ Add necessary npm packages for Cloud Functions
- ✅ Update `package.json` in `functions/` directory
- ✅ Pin to specific version numbers (e.g., `"firebase-admin": "12.0.0"` not `^12.0.0`) to ensure consistent builds
- ❌ Avoid large dependencies (check bundle size)
- Note: GitHub Actions automatically runs `npm install` during deployment

### Firebase Configuration

**Cloud Functions Config** (for secrets):

```bash
# Set secrets (done via GitHub Actions for deployments)
firebase functions:config:set key="value"

# Get current config
firebase functions:config:get
```

**In GitHub Actions**, secrets are set via environment variables and should be configured as GitHub Secrets.

### Branching Strategy

If you are behind on the latest main branch, always rebase your feature branch before creating a PR to ensure a clean merge and to avoid conflicts. If this happens after your PR is created, update your PR branch by rebasing against main.

## Common Tasks

### Adding a New Cloud Function

1. Edit `functions/index.js`
2. Export the new function: `exports.functionName = ...`
3. Add appropriate CORS handling
4. Add error handling and logging
5. Document the function with JSDoc comments
6. **⚠️ CRITICAL: Update `FUNCTIONS.md`** with:
   - Endpoint documentation (method, path)
   - Request body schema
   - Response schema
   - Error responses
   - cURL testing example
7. **Test with emulator** (see Testing section above)
8. Deploy via GitHub Actions (merge to main or create PR for preview)

**Note:** Documentation updates to `FUNCTIONS.md` are REQUIRED, not optional. This ensures the API reference stays in sync with implementation.

### Updating Firestore Rules

1. Edit `firestore.rules`
2. **Test rules with emulator:**
   ```bash
   firebase emulators:start
   # Test operations via Emulator UI or cURL
   ```
3. Deploy via GitHub Actions (included in `firebase deploy`)

### Testing Frontend Changes

1. Make changes to `public/app.js`, `index.html`, or `styles.css`
2. **Start emulator:**
   ```bash
   firebase emulators:start
   ```
3. Open http://localhost:5000 in browser
4. Test on both desktop and mobile viewports
5. Verify offline functionality (Network tab → Offline)
6. Check browser console for errors

### Debugging Function Issues

**View real-time logs:**

- Terminal running `firebase emulators:start` shows all logs
- Emulator UI (http://localhost:4000) → Logs tab

**Common issues:**

- CORS errors → Check `cors({origin: true})` is present
- Firestore permission errors → Check `firestore.rules`
- Missing dependencies → Run `cd functions && npm install`
- Java errors → Ensure Java 21+ is installed (required for emulators)

### Adding a New PWA Feature

1. Edit `public/app.js` and/or `public/index.html`
2. Update `public/styles.css` if needed
3. Update Service Worker (`public/sw.js`) cache if adding new assets
4. Test offline functionality
5. Deploy via GitHub Actions

### Updating PWA Manifest

1. Edit `public/manifest.json`
2. Update app icons in `public/icons/` if needed
3. Test installation on mobile device
4. Deploy via GitHub Actions

## Security Best Practices

- ✅ **ALWAYS** validate user input in Cloud Functions
- ✅ **ALWAYS** use Firestore security rules (never rely on client-side checks)
- ✅ **ALWAYS** use HTTPS (Firebase Hosting enforces this)
- ❌ **NEVER** commit API keys or secrets to the repository
- ❌ **NEVER** trust client-side data without validation
- ✅ Store secrets in GitHub Secrets for CI/CD
- ✅ Use Firebase Functions config for runtime secrets

**Firestore Security Rules:**

- Default to deny unless explicitly allowed
- Validate data types and required fields
- Use authentication when needed (currently optional)

## AI Integration (Gemini API)

**Current Status:** Placeholder implementation (not fully integrated)

**Future Integration:**

- Cloud Function will call Gemini API
- API key stored in Firebase Functions config
- Vision API for photo analysis
- Training on seed recipes from Firestore

**When integrating:**

1. Use `@google-cloud/aiplatform` package (already in dependencies)
2. Retrieve API key from `functions.config().gemini.api_key`
3. Handle API errors gracefully
4. Implement rate limiting if needed
5. Cache results when appropriate

## Firestore Collections

See [FUNCTIONS.md](../FUNCTIONS.md) for detailed schema documentation.

## Troubleshooting

### Common Issues

**Firebase deployment fails:**

- Check `FIREBASE_TOKEN` secret is set in GitHub
- Verify `firebase.json` configuration is correct
- Check Cloud Functions logs: `firebase functions:log`

**Cloud Functions errors:**

- Check function logs in Firebase Console
- Verify all required config values are set
- Check CORS is properly configured
- Ensure dependencies are installed

**PWA not installable:**

- Verify `manifest.json` is valid
- Check app icons exist in `public/icons/`
- Ensure HTTPS (required for PWA)
- Test with Lighthouse audit

**Service Worker issues:**

- Clear browser cache
- Update service worker version number
- Check console for SW errors
- Verify all cached resources exist

## Learning and Improvements

**If you find yourself correcting me often on specific topics:**

1. **Update this file** (`.github/copilot-instructions.md`):
   - Add new sections for recurring issues
   - Clarify existing guidelines
   - Add more examples

2. **Or create/update `MEMORY.md`**:
   - Track specific decisions made
   - Document why certain approaches were chosen
   - Keep a running log of learnings

**This helps improve future interactions and reduces repeated corrections.**

## Learning and Improvements

**If you find yourself correcting me often on specific topics:**

1. **Update this file** (`.github/copilot-instructions.md`)
2. **Or update `MEMORY.md`** for specific decisions and learnings

---

**Remember:** Test with emulators, update FUNCTIONS.md, deploy via GitHub Actions. 🚀

# ✅ Setup Checklist

Print this page or keep it open while you set up your Firebase project.

---

## Phase 1: Repository Setup

- [ ] Click "Use this template" on GitHub
- [ ] Name your new repository
- [ ] Clone to your local machine
  ```bash
  git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
  cd YOUR-REPO
  ```

## Phase 2: Install Dependencies

- [ ] Install root dependencies
  ```bash
  npm install
  ```
- [ ] Install functions dependencies
  ```bash
  cd functions && npm install && cd ..
  ```
- [ ] Install Firebase CLI globally
  ```bash
  npm install -g firebase-tools
  ```

## Phase 3: Firebase Project

- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Create new project (name it!)
- [ ] Write down your Project ID: `________________`
- [ ] Enable Firestore Database (test mode)
- [ ] Enable Cloud Functions
- [ ] Enable Firebase Hosting

## Phase 4: Link Project

- [ ] Login to Firebase
  ```bash
  firebase login
  ```
- [ ] Link to your project
  ```bash
  firebase use --add
  ```
- [ ] Select your project from the list
- [ ] Press Enter for default alias

## Phase 5: Update Configuration

- [ ] Update `.firebaserc` with your Project ID
- [ ] Update `public/app.js` (search for project ID)
- [ ] Update `.github/workflows/firebase-deploy-prod.yml`
- [ ] Update `.github/workflows/firebase-preview.yml`
- [ ] Update `.github/workflows/firebase-preview-teardown.yml`
- [ ] Update `.github/workflows/firebase-project-setup.yml`

**Tip**: Use find/replace in your editor to replace `fpl-tool-dfb38` with your project ID.

## Phase 6: Test Locally (Optional)

- [ ] Start emulators
  ```bash
  firebase emulators:start
  ```
- [ ] Open http://localhost:5000
- [ ] See your app running? ✅
- [ ] Press Ctrl+C to stop

## Phase 7: First Deployment

- [ ] Deploy to Firebase
  ```bash
  firebase deploy
  ```
- [ ] Wait for deployment to complete
- [ ] Note your app URL: `https://__________.web.app`
- [ ] Visit your app URL - does it work? ✅

## Phase 8: GitHub Actions Setup (CI/CD)

**This is the most commonly skipped step - don't skip it!**

- [ ] Generate Firebase token
  ```bash
  firebase login:ci
  ```
- [ ] Copy the token (it's long!)
  Token: `_________________________________`

- [ ] Go to GitHub.com → Your repository
- [ ] Click Settings → Secrets and variables → Actions
- [ ] Click "New repository secret"
- [ ] Name: `FIREBASE_TOKEN`
- [ ] Value: Paste the token
- [ ] Click "Add secret"

## Phase 9: Verify Auto-Deploy

- [ ] Make a small change (e.g., edit `public/index.html`)
- [ ] Commit and push
  ```bash
  git add .
  git commit -m "Test auto-deploy"
  git push
  ```
- [ ] Go to Actions tab on GitHub
- [ ] Watch the workflow run
- [ ] See a ✅ green check? Success!
- [ ] Visit your app - see the change? ✅

## Phase 10: Cleanup & Customize

- [ ] Update README.md with your project name
- [ ] Update `public/manifest.json` with your app name
- [ ] Change app icon/emoji
- [ ] Remove template-specific docs (optional)
- [ ] Add your own documentation

---

## 🎉 You're Done!

Your Firebase app is now:
- ✅ Deployed and live
- ✅ Auto-deploying on push to main
- ✅ Creating preview deployments for PRs
- ✅ Ready to customize

## Next Steps

- [ ] Read [DEVELOPMENT.md](DEVELOPMENT.md) for workflow
- [ ] Bookmark [QUICK-REFERENCE.md](QUICK-REFERENCE.md)
- [ ] Start building your features!

## Troubleshooting

**Something not working?**

1. Check [SETUP.md Troubleshooting](SETUP.md#-troubleshooting)
2. Review the step you're on
3. Check error messages carefully
4. [Open an issue](https://github.com/aarons22/fpl-tool/issues/new?template=setup-help.md) if stuck

## Time Check

**Where should you be?**

- ⏱️ 0-10 min: Phases 1-2 (Setup & Install)
- ⏱️ 10-15 min: Phases 3-4 (Firebase & Link)
- ⏱️ 15-20 min: Phase 5 (Update Config)
- ⏱️ 20-25 min: Phases 6-7 (Test & Deploy)
- ⏱️ 25-30 min: Phases 8-9 (CI/CD Setup)
- ⏱️ 30+ min: Phase 10 (Customize)

**Taking longer?** That's okay! Take your time and don't skip steps.

---

**Keep this checklist until everything works!** ✨

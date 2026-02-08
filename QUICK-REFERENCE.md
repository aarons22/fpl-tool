# 🎯 Quick Reference

## Common Commands

### Development
```bash
# Start everything locally
firebase emulators:start

# Start hosting only
npm run serve

# Open emulator UI
# → http://localhost:4000
```

### Deployment
```bash
# Deploy everything
firebase deploy

# Deploy specific service
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

### Testing
```bash
# Lint Cloud Functions
cd functions && npm run lint

# Test function locally
curl http://localhost:5001/YOUR-PROJECT/us-central1/helloWorld
```

### Setup
```bash
# Login to Firebase
firebase login

# Generate CI/CD token
firebase login:ci

# Link to project
firebase use --add

# List your projects
firebase projects:list
```

## File Structure

```
📁 Your Repository
├── 📁 public/          ← Frontend files (HTML, CSS, JS)
├── 📁 functions/       ← Backend Cloud Functions
├── 📁 .github/workflows/ ← CI/CD automation
├── 📄 firebase.json    ← Firebase configuration
├── 📄 firestore.rules  ← Database security
├── 📄 SETUP.md        ← First-time setup guide
└── 📄 DEVELOPMENT.md  ← Development guide
```

## URLs

### Local Development
- **Web App**: http://localhost:5000
- **Functions**: http://localhost:5001
- **Firestore**: http://localhost:8080
- **Emulator UI**: http://localhost:4000

### Production
- **Web App**: `https://YOUR-PROJECT-ID.web.app`
- **Functions**: `https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net`
- **Console**: https://console.firebase.google.com

## GitHub Actions Triggers

| Action | Trigger | Result |
|--------|---------|--------|
| Push to `main` | Automatic | Production deployment |
| Open PR | Automatic | Preview deployment |
| Close PR | Automatic | Preview cleanup |
| Manual workflow | Actions tab | Run setup/deploy |

## Required Secrets

| Secret | Where to Add | How to Get |
|--------|-------------|------------|
| `FIREBASE_TOKEN` | Repository Settings → Secrets | Run `firebase login:ci` |

## Checklist for New Projects

- [ ] Click "Use this template"
- [ ] Clone your new repo
- [ ] Run `npm install` (root and functions/)
- [ ] Create Firebase project
- [ ] Run `firebase use --add`
- [ ] Update project ID in `.firebaserc`
- [ ] Update project ID in `public/app.js`
- [ ] Update project ID in `.github/workflows/*.yml`
- [ ] Generate token with `firebase login:ci`
- [ ] Add `FIREBASE_TOKEN` to GitHub Secrets
- [ ] Push to main → Watch it deploy! 🚀

## Helpful Links

- 📖 [Full Setup Guide](SETUP.md)
- 💻 [Development Guide](DEVELOPMENT.md)
- 🔥 [Firebase Console](https://console.firebase.google.com)
- 🐙 [GitHub Actions](https://github.com/YOUR-USERNAME/YOUR-REPO/actions)

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "FIREBASE_TOKEN not set" | Add secret in GitHub repo settings |
| "Permission denied" | Run `firebase login` |
| Emulators won't start | Install Java 21+ |
| Functions fail in production | Enable billing in Firebase Console |

## Tips & Tricks

💡 **Use emulators** for all development - saves money and is faster

💡 **Test locally** before pushing to avoid failed deployments

💡 **Check preview URLs** on PRs before merging

💡 **Set budget alerts** in Firebase Console

💡 **Use `.env` files** for local secrets (never commit them!)

---

Need more help? Check [SETUP.md](SETUP.md) or [DEVELOPMENT.md](DEVELOPMENT.md)

# 📝 Using This Template

## Creating a New Project

### Step 1: Use This Template

1. Click the green **"Use this template"** button at the top of this repository
2. Select **"Create a new repository"**
3. Choose a repository name (e.g., `my-awesome-app`)
4. Choose visibility (Public or Private)
5. Click **"Create repository from template"**

GitHub will create a fresh copy of this template in your account.

### Step 2: Clone Your New Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
```

### Step 3: Follow the Setup Guide

Go to **[SETUP.md](SETUP.md)** and follow all the steps.

## What Gets Copied?

When you use this template, you get:

✅ **All code files**
- Frontend (`public/`)
- Backend (`functions/`)
- Configuration files

✅ **GitHub Actions workflows**
- Production deployment
- Preview deployments
- Setup workflow

✅ **Documentation**
- README.md
- SETUP.md
- DEVELOPMENT.md
- QUICK-REFERENCE.md

❌ **What's NOT copied:**
- Git history (you start fresh)
- GitHub Issues
- GitHub Actions runs
- Deployed Firebase projects

## After Creating from Template

You'll need to:

1. **Install dependencies** (`npm install`)
2. **Create a new Firebase project** (can't reuse the template's project)
3. **Update project IDs** in:
   - `.firebaserc`
   - `public/app.js`
   - `.github/workflows/*.yml`
4. **Set up GitHub Secrets** (`FIREBASE_TOKEN`)
5. **Deploy!**

Full instructions in **[SETUP.md](SETUP.md)**.

## Customizing Your App

### Frontend

Edit files in `public/`:
- `index.html` - Structure and content
- `styles.css` - Styling
- `app.js` - JavaScript logic
- `manifest.json` - PWA metadata

### Backend

Edit `functions/index.js`:
- Add new Cloud Functions
- Modify existing functions
- Add API endpoints

### Database

Edit `firestore.rules`:
- Define security rules
- Control data access
- Add validation

## Best Practices

### 1. Rename Your Project

Update these to match your project name:
- Repository name on GitHub
- `package.json` → `name` field
- `public/manifest.json` → `name` and `short_name`
- `README.md` title

### 2. Update Branding

- Change the emoji in `index.html` (🚀 → your choice)
- Update colors in `styles.css` and `manifest.json`
- Replace icon files in `public/icons/` with your own

### 3. Clean Up Documentation

After setup, you might want to:
- Update `README.md` with your project details
- Remove or archive `SETUP.md` if not needed
- Add your own documentation

### 4. Set Up Project-Specific Items

- Add environment-specific configs
- Set up error tracking (Sentry, etc.)
- Configure analytics
- Add custom domain

## Common Customizations

### Add Authentication

```javascript
// In functions/index.js
const admin = require('firebase-admin');

// Verify Firebase Auth token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Add a New API Endpoint

```javascript
// In functions/index.js
exports.myNewEndpoint = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    // Your code here
    return response.json({ message: 'Success!' });
  });
});
```

### Add Database Operations

```javascript
const db = admin.firestore();

// Read data
const doc = await db.collection('users').doc(userId).get();

// Write data
await db.collection('users').doc(userId).set({ name: 'Alice' });

// Query data
const snapshot = await db.collection('users')
  .where('age', '>', 18)
  .get();
```

## Template Updates

This template may receive updates. To get updates:

### Option 1: Manual Update
1. Check the original template repository for changes
2. Manually copy changes you want
3. Test thoroughly

### Option 2: Git Remote
```bash
# Add template as remote
git remote add template https://github.com/ORIGINAL-OWNER/TEMPLATE-REPO.git

# Fetch template updates
git fetch template

# Merge updates (may have conflicts)
git merge template/main
```

⚠️ **Warning**: Merging updates may overwrite your customizations!

## Getting Help

- **Setup issues?** → [SETUP.md](SETUP.md#-troubleshooting)
- **Development questions?** → [DEVELOPMENT.md](DEVELOPMENT.md)
- **Found a bug in template?** → Open an issue on the template repository
- **Need feature in template?** → Open a feature request

## Template Feedback

If you're using this template, we'd love to hear:
- What worked well?
- What was confusing?
- What's missing?
- Suggestions for improvement?

Open an issue or discussion on the template repository!

---

**Ready to start?** → Go to [SETUP.md](SETUP.md)

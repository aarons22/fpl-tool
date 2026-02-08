# 🚀 First-Time Setup Guide

This guide will walk you through setting up this Firebase template for your own project, including GitHub Actions CI/CD.

## ✅ Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 20+ installed ([Download here](https://nodejs.org/))
- [ ] Git installed
- [ ] A GitHub account
- [ ] A Google account (for Firebase)

## 📋 Setup Steps

### Step 1: Create Your Repository from Template

1. Click the **"Use this template"** button at the top of this repository
2. Choose a name for your new repository
3. Clone your new repository to your local machine:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

### Step 3: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 4: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., `my-awesome-app`)
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**
6. Wait for the project to be created

### Step 5: Enable Firebase Services

In your Firebase Console:

1. **Firestore Database**
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in test mode" for development
   - Select a location (choose closest to your users)
   - Click "Enable"

2. **Cloud Functions**
   - Click "Functions" in the left sidebar
   - Click "Get started" if prompted
   - Functions will be enabled automatically when you deploy

3. **Firebase Hosting**
   - Click "Hosting" in the left sidebar
   - Click "Get started"
   - Follow the prompts (you can skip the CLI steps as we'll do this next)

### Step 6: Link Your Local Project to Firebase

```bash
# Login to Firebase
firebase login

# Initialize and link to your project
firebase use --add
```

When prompted:
- Select the Firebase project you created in Step 4
- Enter an alias (just press Enter to use "default")

### Step 7: Update Project Configuration

Edit `.firebaserc` to use your project ID:

```json
{
  "projects": {
    "default": "YOUR-PROJECT-ID"
  }
}
```

Replace `YOUR-PROJECT-ID` with your actual Firebase project ID (found in Firebase Console → Project Settings).

Also update these files with your project ID:
- `public/app.js` - Update the `getCloudFunctionUrl()` function
- All workflow files in `.github/workflows/` - Replace `fpl-tool-dfb38` with your project ID

### Step 8: Test Locally (Optional but Recommended)

```bash
# Start Firebase emulators
firebase emulators:start
```

Open http://localhost:5000 to see your app running locally.

Press `Ctrl+C` to stop the emulators.

### Step 9: Deploy Manually (First Time)

```bash
# Deploy everything to Firebase
firebase deploy
```

This will deploy:
- ✅ Hosting (your web app)
- ✅ Cloud Functions
- ✅ Firestore security rules
- ✅ Firestore indexes

After deployment, your app will be available at:
```
https://YOUR-PROJECT-ID.web.app
```

## 🔄 Setting Up GitHub Actions (CI/CD)

To enable automatic deployments via GitHub Actions, you need to set up a Firebase token.

### Step 10: Generate Firebase Token

Run this command in your terminal:

```bash
firebase login:ci
```

This will:
1. Open a browser window for you to authenticate
2. After authentication, display a token in your terminal
3. **Copy this token** - you'll need it in the next step

The token will look something like:
```
1//abc123def456...
```

⚠️ **Important**: Keep this token secret! Don't commit it to your repository.

### Step 11: Add Token to GitHub Secrets

1. Go to your GitHub repository on GitHub.com
2. Click **"Settings"** (repository settings, not your account)
3. In the left sidebar, click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**
5. Set the name to: `FIREBASE_TOKEN`
6. Paste the token you copied in Step 10
7. Click **"Add secret"**

### Step 12: Verify GitHub Actions Setup

1. Go to the **"Actions"** tab in your repository
2. You should see workflows listed:
   - Deploy to Firebase Production
   - Deploy to Firebase Preview
   - Firebase Project Setup

If you see a green checkmark, you're all set! ✅

If you see errors, check the troubleshooting section below.

## 🎉 You're Done!

Your Firebase template is now fully set up with CI/CD!

### What Happens Now?

- **Push to `main` branch** → Automatic production deployment
- **Open a Pull Request** → Automatic preview deployment (gets a unique URL)
- **Close a Pull Request** → Preview automatically deleted

## 🔧 Troubleshooting

### "FIREBASE_TOKEN is not set" Error

**Problem**: GitHub Actions workflow fails with this error.

**Solution**: Make sure you completed Steps 10-11 above. The secret must be named exactly `FIREBASE_TOKEN`.

### "Permission denied" or "Unauthorized" Error

**Problem**: Firebase CLI can't access your project.

**Solution**: 
1. Make sure you ran `firebase login`
2. Check that you selected the correct project with `firebase use --add`
3. Verify you have Owner or Editor role in Firebase Console → Project Settings → Users and permissions

### "Project not found" Error

**Problem**: Firebase can't find your project.

**Solution**:
1. Verify your project ID in `.firebaserc` matches your Firebase Console project ID
2. Check that the project exists in [Firebase Console](https://console.firebase.google.com/)
3. Run `firebase projects:list` to see all your projects

### Emulators Won't Start

**Problem**: `firebase emulators:start` fails.

**Solution**:
1. Make sure Java 21+ is installed (required for emulators)
2. Check if ports 5000, 5001, 8080, 4000 are available
3. Try `firebase emulators:start --only hosting` to start just the hosting emulator

### GitHub Actions Workflow Fails

**Problem**: Deployment fails in GitHub Actions.

**Solution**:
1. Check the workflow logs in the Actions tab
2. Verify `FIREBASE_TOKEN` secret is set correctly
3. Make sure your Firebase project has billing enabled (required for Cloud Functions)
4. Check that you've updated all project IDs in the workflow files

## 📚 Next Steps

- Read [DEVELOPMENT.md](DEVELOPMENT.md) for local development workflow
- Customize `public/index.html` for your app
- Add your own Cloud Functions in `functions/index.js`
- Update `README.md` with your project details

## 💡 Tips

- **Use the emulators** during development to avoid deployment costs
- **Test locally first** before pushing to main
- **Review PR preview deployments** before merging
- **Check Firebase Console** for usage and logs
- **Set up budget alerts** in Firebase Console to avoid surprises

## 🆘 Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- Open an issue in this repository

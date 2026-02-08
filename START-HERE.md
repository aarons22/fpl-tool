# 🎯 START HERE - Complete Beginner's Guide

**Never used Firebase or GitHub Actions before? Start here!**

This guide assumes you know NOTHING and walks you through every single step.

---

## ⏱️ Time Required: 30-45 minutes

Take your time and don't skip any steps!

---

## Part 1: Before You Begin (5 minutes)

### What You Need

Open these in browser tabs now:

1. **Firebase Console**: https://console.firebase.google.com/
2. **Your GitHub Repository**: https://github.com/YOUR-USERNAME/YOUR-REPO
3. **This Guide**: Keep this tab open!

### Create Accounts (if you don't have them)

- [ ] **Google Account** - Need one for Firebase
  - Go to https://accounts.google.com/signup
  - Create account (free)
  
- [ ] **GitHub Account** - Need one for code hosting
  - Go to https://github.com/join
  - Create account (free)

### Install Software on Your Computer

- [ ] **Node.js** - Download from https://nodejs.org/
  - Click the big green button "Download Node.js (LTS)"
  - Run the installer
  - Accept all defaults
  - Verify: Open terminal/command prompt, type `node --version`
  - Should see something like `v20.x.x`

- [ ] **Git** - Download from https://git-scm.com/downloads
  - Download for your OS (Windows/Mac/Linux)
  - Run installer
  - Accept all defaults
  - Verify: Open terminal, type `git --version`
  - Should see something like `git version 2.x.x`

---

## Part 2: Create Your Repository (5 minutes)

### Step 1: Use This Template

1. **Go to the template repository**
   - URL: https://github.com/aarons22/fpl-tool

2. **Click the green "Use this template" button**
   - It's at the top of the page, next to "Code"
   - If you don't see it, make sure you're logged into GitHub

3. **Fill out the form**:
   - **Repository name**: Give it a name (e.g., `my-awesome-app`)
   - **Description**: (optional) Describe your app
   - **Public or Private**: Choose (Public is fine for learning)
   - Click **"Create repository from template"**

4. **Wait for GitHub to create your repo**
   - Takes about 10 seconds
   - You'll be redirected to YOUR new repository

✅ **Success check**: You should see your repository at `https://github.com/YOUR-USERNAME/YOUR-REPO-NAME`

### Step 2: Clone to Your Computer

1. **On your repository page**, click the green **"Code"** button

2. **Copy the URL**
   - Make sure "HTTPS" is selected
   - Click the copy icon
   - URL looks like: `https://github.com/YOUR-USERNAME/YOUR-REPO.git`

3. **Open Terminal/Command Prompt**
   - **Mac**: Applications → Utilities → Terminal
   - **Windows**: Start → type "cmd" → Enter
   - **Linux**: Ctrl+Alt+T

4. **Navigate to where you want to put the code**
   ```bash
   cd Desktop
   # or wherever you want it
   ```

5. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
   ```
   - Replace with YOUR actual URL from step 2

6. **Go into the folder**
   ```bash
   cd YOUR-REPO-NAME
   ```
   - Replace YOUR-REPO-NAME with your actual repo name

✅ **Success check**: Type `ls` (Mac/Linux) or `dir` (Windows) - you should see files like `README.md`, `package.json`, etc.

---

## Part 3: Install Everything (5 minutes)

### Step 3: Install Project Dependencies

**Still in your terminal, in your project folder:**

1. **Install root dependencies**
   ```bash
   npm install
   ```
   - This will take 1-2 minutes
   - You'll see a lot of text scrolling by - that's normal!
   - Wait until you see a message like "added 795 packages"

2. **Install Cloud Functions dependencies**
   ```bash
   cd functions
   npm install
   cd ..
   ```
   - Another 30 seconds or so
   - You'll see "added 320 packages" or similar

3. **Install Firebase CLI globally**
   ```bash
   npm install -g firebase-tools
   ```
   - This installs the Firebase command-line tool
   - Takes about 30 seconds
   - You might see some warnings - ignore them

4. **Verify Firebase CLI installed**
   ```bash
   firebase --version
   ```
   - Should see something like `13.0.0` or higher

✅ **Success check**: All three `npm install` commands completed without errors

---

## Part 4: Create Firebase Project (10 minutes)

### Step 4: Login to Firebase

1. **In your terminal**, type:
   ```bash
   firebase login
   ```

2. **Firebase will ask: "Allow Firebase to collect CLI usage and error reporting information?"**
   - Type `y` and press Enter (or just press Enter)

3. **Your browser will open automatically**
   - If it doesn't, Firebase will show you a URL to copy

4. **Sign in with your Google account**
   - Use the same Google account you want to use for Firebase

5. **Click "Allow"** when Firebase asks for permissions

6. **Success message in browser**: "Success! You may now close this tab."

7. **Back in terminal**: You should see "Success! Logged in as your@email.com"

✅ **Success check**: Terminal says you're logged in

### Step 5: Create a New Firebase Project

**Now we create your actual Firebase project on Google's servers:**

1. **Open Firefox Console in browser**: https://console.firebase.google.com/

2. **Click "Add project"** (or "Create a project")
   - Big button in the center or top-left

3. **Step 1 of 3: Name your project**
   - **Project name**: Type a name (e.g., `my-awesome-app`)
   - Firebase will suggest a Project ID below (e.g., `my-awesome-app-a1b2c`)
   - **IMPORTANT**: Write down or copy this Project ID!
   - Project ID: `_____________________________`
   - Click **"Continue"**

4. **Step 2 of 3: Google Analytics**
   - This is optional
   - You can toggle it OFF for now (keeps things simple)
   - Click **"Continue"** or **"Create project"**

5. **Wait for Firebase to create your project**
   - Shows a progress screen
   - Takes about 30-60 seconds
   - Don't close the browser!

6. **Click "Continue"** when it says "Your new project is ready"

✅ **Success check**: You see your project dashboard with "Get started by adding Firebase to your app"

### Step 6: Enable Required Services

**You need to turn on 3 Firebase features:**

#### 6a. Enable Firestore Database

1. **In Firebase Console**, look at the left sidebar
2. **Click "Firestore Database"**
3. **Click "Create database"** button
4. **Choose mode**: Select **"Start in test mode"**
   - This is for development - we'll secure it later
   - Click **"Next"**
5. **Choose location**: Pick one close to where your users will be
   - US: `us-central1`
   - Europe: `europe-west1`
   - Asia: `asia-southeast1`
   - Click **"Enable"**
6. **Wait about 30 seconds** for it to enable

✅ **Success check**: You see the Firestore Database console with "Start collection" button

#### 6b. Enable Cloud Functions

1. **In left sidebar**, click **"Functions"**
2. If you see "Get started", click it
   - Otherwise, it might already be enabled
3. **Upgrade message?**: 
   - If you see "Upgrade required", click "Upgrade project"
   - Choose **"Blaze (pay as you go)"** plan
   - **Don't worry!** You get a generous free tier
   - Add a payment method (credit/debit card)
   - Set budget alerts if you want (optional)
4. If you DON'T see upgrade message, Functions is ready!

✅ **Success check**: You see Functions dashboard (might be empty - that's fine!)

#### 6c. Enable Hosting

1. **In left sidebar**, click **"Hosting"**
2. **Click "Get started"** if you see it
3. **Follow the wizard**:
   - Step 1: Click **"Next"** (we'll install CLI later)
   - Step 2: Click **"Next"** (we'll deploy later)  
   - Step 3: Click **"Continue to console"**

✅ **Success check**: You see Hosting dashboard

---

## Part 5: Link Your Computer to Firebase (5 minutes)

### Step 7: Connect Your Local Code to Firebase Project

**Back in your terminal:**

1. **Make sure you're in your project folder**
   ```bash
   pwd
   # Should show path ending in your repo name
   ```

2. **Link to your Firebase project**
   ```bash
   firebase use --add
   ```

3. **Select your project from the list**
   - Use arrow keys ↑ ↓ to navigate
   - Press Enter to select your project
   - You should see the project ID you wrote down earlier

4. **What alias would you like to use?**
   - Just press Enter (uses "default")

5. **You should see**: "Created alias default for PROJECT-ID"

✅ **Success check**: Type `firebase use` - should show your project as active

---

## Part 6: Update Configuration Files (10 minutes)

### Step 8: Update Project ID in All Files

**Your project has the old template project ID. We need to replace it with YOURS.**

**Your Project ID**: `_____________________________` (from Step 5)

#### Files to Update:

**Method A: Using Find & Replace (Recommended)**

1. **Open your project in a code editor**
   - VS Code (free): https://code.visualstudio.com/
   - Or any text editor

2. **Use Find & Replace** (Ctrl+Shift+F or Cmd+Shift+F)
   - Find: `fpl-tool-dfb38`
   - Replace with: YOUR-PROJECT-ID (from Step 5)
   - Click "Replace All"

**Method B: Manual (if you prefer)**

Edit these files and replace `fpl-tool-dfb38` with your project ID:

1. **`.firebaserc`**
   ```json
   {
     "projects": {
       "default": "YOUR-PROJECT-ID"
     }
   }
   ```

2. **`public/app.js`** - Line 9 and other places
   - Look for `fpl-tool-dfb38`
   - Replace with YOUR-PROJECT-ID

3. **`.github/workflows/firebase-deploy-prod.yml`** - Line 33
4. **`.github/workflows/firebase-preview.yml`** - Lines 38, 46, 52
5. **`.github/workflows/firebase-preview-teardown.yml`** - Line 36, 42
6. **`.github/workflows/firebase-project-setup.yml`** - Lines 45, 51, 57, 63, 69, 76, 79

**After updating, save all files!**

✅ **Success check**: Search for `fpl-tool-dfb38` in your project - should find ZERO results

---

## Part 7: Test Locally (OPTIONAL but recommended - 10 minutes)

### Step 9: Run the App on Your Computer

1. **Start Firebase emulators**
   ```bash
   firebase emulators:start
   ```

2. **You might see**:
   - "Java not found" error? → Install Java: https://adoptium.net/
   - Otherwise, should see "All emulators ready!"

3. **Open your browser** to: http://localhost:5000

4. **You should see your web app!**
   - It says "Firebase Web App" with a rocket 🚀
   - There's a "Test Cloud Function" button

5. **Test it**: Click the button
   - Should see "Hello from Firebase!" message

6. **Stop the emulators**: Press Ctrl+C in terminal

✅ **Success check**: App loads at localhost:5000

---

## Part 8: Deploy to Firebase (5 minutes)

### Step 10: Put Your App on the Internet

1. **In terminal, deploy everything**:
   ```bash
   firebase deploy
   ```

2. **Wait for deployment**
   - Takes 2-3 minutes
   - You'll see progress for: functions, hosting, firestore rules
   - Might see warnings - that's usually okay

3. **Look for "Deploy complete!"**

4. **Find your app URL**
   - Look for: "Hosting URL: https://YOUR-PROJECT-ID.web.app"
   - **COPY THIS URL**: `_____________________________`

5. **Visit your app**
   - Open the URL in your browser
   - You should see your app LIVE on the internet!

✅ **Success check**: Your app is live at https://YOUR-PROJECT-ID.web.app

---

## Part 9: Setup GitHub Actions (AUTO-DEPLOY) (10 minutes)

### Step 11: Generate Firebase Token

**This is THE most important part for auto-deploy!**

1. **In terminal**, run:
   ```bash
   firebase login:ci
   ```

2. **Browser opens automatically**
   - Sign in with your Google account
   - Click "Allow"

3. **Back in terminal**: You'll see a long token
   ```
   ✔  Success! Use this token to login on a CI server:

   1//abc123...very-long-string...xyz789
   
   Example: firebase deploy --token "$FIREBASE_TOKEN"
   ```

4. **COPY THE ENTIRE TOKEN**
   - Select all the text after "CI server:"
   - Copy it (Ctrl+C or Cmd+C)
   - **DO NOT SHARE THIS TOKEN!** It's like a password

5. **Save it temporarily**
   - Paste into a text file
   - Or keep this terminal window open
   - You'll need it in the next step!

✅ **Success check**: You have the token copied

### Step 12: Add Token to GitHub

**Now we tell GitHub about this token:**

1. **Open GitHub in browser**: https://github.com/YOUR-USERNAME/YOUR-REPO

2. **Click "Settings"** (top navigation bar)
   - Make sure you're in REPOSITORY settings, not your account settings
   - Should see "Options", "Collaborators", etc. in left sidebar

3. **In left sidebar**: Click **"Secrets and variables"** → **"Actions"**

4. **Click "New repository secret"** (green button)

5. **Fill out the form**:
   - **Name**: `FIREBASE_TOKEN` (exactly like this, all caps)
   - **Secret**: Paste the token from Step 11
   - Click **"Add secret"**

6. **Verify**:
   - You should see `FIREBASE_TOKEN` in the list
   - The value shows as `***` (hidden)
   - Updated: "now"

✅ **Success check**: FIREBASE_TOKEN appears in your secrets list

---

## Part 10: Test Auto-Deploy (5 minutes)

### Step 13: Make a Change and Push

**Let's test if auto-deploy works:**

1. **Open `public/index.html` in your code editor**

2. **Find line 31** (the h1 with the rocket):
   ```html
   <h1>🚀 Firebase Web App</h1>
   ```

3. **Change it to**:
   ```html
   <h1>🚀 My Awesome App</h1>
   ```

4. **Save the file**

5. **In terminal, commit and push**:
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push
   ```

6. **Watch GitHub Actions work**:
   - Go to your repo on GitHub
   - Click **"Actions"** tab
   - You should see a workflow running (yellow dot)
   - Wait for it to finish (green check ✅)
   - Takes about 2-3 minutes

7. **Check your live app**:
   - Go to https://YOUR-PROJECT-ID.web.app
   - Refresh the page
   - Should now say "My Awesome App" instead of "Firebase Web App"!

✅ **Success check**: Change appears on your live site automatically!

---

## 🎉 YOU'RE DONE!

### What You Accomplished

You now have:
- ✅ A Firebase project
- ✅ A web app deployed and live on the internet
- ✅ Auto-deployment set up (push to GitHub = auto-update)
- ✅ All the tools installed
- ✅ Everything configured correctly

### Your App URLs

Write these down:

- **Live App**: https://YOUR-PROJECT-ID.web.app
- **Firebase Console**: https://console.firebase.google.com/project/YOUR-PROJECT-ID
- **GitHub Repo**: https://github.com/YOUR-USERNAME/YOUR-REPO

### What Happens Now?

Every time you:
1. Make changes to your code
2. Commit: `git commit -m "description"`
3. Push: `git push`

→ GitHub Actions automatically deploys to Firebase!
→ Your live app updates in 2-3 minutes!

---

## 🆘 Something Went Wrong?

### Common Issues

**"Java not found" when running emulators**
- Install Java 21: https://adoptium.net/
- Restart terminal after installing

**"Permission denied" when deploying**
- Run `firebase login` again
- Make sure you're using the same Google account

**"FIREBASE_TOKEN not set" in GitHub Actions**
- Go back to Part 9, Step 12
- Make sure name is EXACTLY: `FIREBASE_TOKEN` (all caps)
- Regenerate token if needed: `firebase login:ci`

**Deployment succeeds but app doesn't change**
- Clear your browser cache (Ctrl+Shift+R)
- Wait 2-3 minutes for CDN to update
- Check Firebase Console → Hosting for latest deploy time

**GitHub Actions failing**
- Check Actions tab for error message
- Common: Make sure FIREBASE_TOKEN is set
- Common: Make sure billing is enabled in Firebase

### Get Help

1. Check [SETUP.md Troubleshooting](SETUP.md#-troubleshooting)
2. Search error message online
3. [Open an issue](https://github.com/aarons22/fpl-tool/issues/new?template=setup-help.md)

---

## 📚 Next Steps

Now that everything works:

- **Read** [DEVELOPMENT.md](DEVELOPMENT.md) - Learn the development workflow
- **Bookmark** [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Command cheat sheet
- **Customize** - Make it your own!
  - Edit `public/index.html` - Change the content
  - Edit `public/styles.css` - Change colors/fonts
  - Edit `functions/index.js` - Add backend features

---

**Congratulations! You did it!** 🎊

You just set up a complete serverless web app with auto-deployment. That's awesome!

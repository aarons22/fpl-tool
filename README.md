# FPL Tool

A Fantasy Premier League (FPL) analytics tool with betting odds integration, built with Firebase and automated CI/CD.

[![Deploy Status](https://img.shields.io/badge/deploy-automated-success)]()
[![Firebase](https://img.shields.io/badge/Firebase-Ready-orange)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

> ⚽ **FPL Analytics Tool** - Analyze Fantasy Premier League data with sports betting odds integration.

---

## 🚀 Quick Start

### 👶 Complete Beginner?

**👉 Go to [START-HERE.md](START-HERE.md) - Complete step-by-step guide with zero assumptions**

This guide assumes you know nothing and walks through:
- Creating a Firebase project (with screenshots)
- Generating the Firebase token (exact steps)
- Setting up GitHub Actions (click-by-click)
- Everything else you need

**Time**: 30-45 minutes | **Experience needed**: None!

### 🎓 Some Experience with Firebase/GitHub?

**👉 Go to [SETUP.md](SETUP.md) - Streamlined setup guide**

Faster guide for developers who know the basics.

**Time**: 15-30 minutes

### 🚀 Already Configured and Developing?

**👉 Go to [DEVELOPMENT.md](DEVELOPMENT.md) - Development workflow**

Continue reading below for quick reference.

---

## 📚 Complete Documentation Index

Choose the guide that matches your needs:

| 📄 Guide | 👥 For Who | ⏱️ Time | 🎯 Purpose |
|----------|-----------|---------|-----------|
| **[START-HERE.md](START-HERE.md)** | Complete beginners | 45 min | Step-by-step from zero |
| **[SETUP.md](SETUP.md)** | Developers with some experience | 20 min | Streamlined setup |
| **[TEMPLATE-USAGE.md](TEMPLATE-USAGE.md)** | Anyone using template | 5 min | How templates work |
| **[FLOWCHART.md](FLOWCHART.md)** | Visual learners | 5 min | See the process |
| **[CHECKLIST.md](CHECKLIST.md)** | Hands-on learners | 20 min | Checkbox format |
| **[DEVELOPMENT.md](DEVELOPMENT.md)** | Active developers | - | Daily workflow |
| **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** | Everyone | - | Command lookup |

**Not sure which one?** → Start with **[START-HERE.md](START-HERE.md)**

## ✨ What's Included

This FPL tool provides everything you need for fantasy football analytics:

- ⚽ **FPL API Integration** - Access Fantasy Premier League player and team data
- 🎲 **Odds API Integration** - Sports betting odds for informed decision-making
- 📱 **Progressive Web App (PWA)** - Installable, works offline
- ☁️ **Serverless Backend** - Cloud Functions for API data processing
- 🗄️ **Database** - Firestore for storing player stats and analysis
- 🚀 **Auto-Deploy** - Push to deploy via GitHub Actions
- 📊 **Real-time Analytics** - Live gameweek data and player performance tracking

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Firebase Cloud Functions (Node.js 20)
- **Database**: Cloud Firestore
- **Hosting**: Firebase Hosting
- **CI/CD**: GitHub Actions

## 📖 Documentation

**Choose your guide based on what you need:**

| 📄 Document | 🎯 Purpose | ⏱️ Time |
|------------|-----------|--------|
| **[SETUP.md](SETUP.md)** | Complete first-time setup guide | 15-30 min |
| **[TEMPLATE-USAGE.md](TEMPLATE-USAGE.md)** | How to use this as a template | 5 min read |
| **[FLOWCHART.md](FLOWCHART.md)** | Visual setup process flowchart | 2 min read |
| **[DEVELOPMENT.md](DEVELOPMENT.md)** | Development workflow & best practices | Reference |
| **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** | Command cheat sheet | Quick lookup |

**New to Firebase or GitHub Actions?** Start with the flowchart → [FLOWCHART.md](FLOWCHART.md)

## 🎯 Use Cases

Perfect for:
- Fantasy Premier League team optimization
- Player performance analysis with betting odds context
- Gameweek planning and transfer decisions
- League standings tracking
- Data-driven FPL strategy development

## 📋 Prerequisites

To use this FPL tool, you'll need:

- Node.js 20 or higher
- A Firebase account (free tier available)
- A GitHub account
- Git installed locally
- **The Odds API key** - Register at [the-odds-api.com](https://the-odds-api.com/) (free tier available)

**Don't have these yet?** See [SETUP.md](SETUP.md) for detailed instructions.

## 🔑 API Configuration

This tool integrates with two external APIs:

### 1. Fantasy Premier League API
- **Base URL**: `https://fantasy.premierleague.com/api/`
- **Authentication**: None required for most endpoints
- **Key Endpoints**:
  - `/bootstrap-static/` - Full player, team, and gameweek data
  - `/fixtures/` - Match fixtures
  - `/element-summary/{player_id}/` - Player details and history
  - `/event/{gameweek}/live/` - Live gameweek data
- **Documentation**: Community-driven, see [FPL API Guide](https://www.oliverlooney.com/blogs/FPL-APIs-Explained)

### 2. The Odds API
- **Base URL**: `https://api.the-odds-api.com/v4/`
- **Authentication**: API key required (get yours at [the-odds-api.com](https://the-odds-api.com/))
- **Key Endpoints**:
  - `/sports/` - List available sports
  - `/sports/{sport}/odds/` - Get odds for specific sport
- **Configuration**: Set `ODDS_API_KEY` environment variable (see below)
- **Documentation**: [Official Docs](https://the-odds-api.com/liveapi/guides/v4/)

### Setting Up API Keys

For local development, create `/functions/.env.local`:
```bash
ODDS_API_KEY=your-odds-api-key-here
```

For production (GitHub Actions), add these secrets to your repository:
- `FIREBASE_TOKEN` - Firebase deployment token
- `ODDS_API_KEY` - Your Odds API key

See [SETUP.md](SETUP.md) for detailed instructions on adding GitHub secrets.

## 🔧 Local Development

### Option 1: Quick Start (Recommended)

```bash
# Start the Firebase emulators
firebase emulators:start
```

This starts everything you need:
- ✅ Web app at http://localhost:5000
- ✅ Cloud Functions at http://localhost:5001
- ✅ Firestore at http://localhost:8080
- ✅ Emulator UI at http://localhost:4000

### Option 2: Hosting Only

```bash
npm run serve
```

This serves just the frontend at http://localhost:5000 (no backend).

### Making Changes

1. Edit files in `public/` for frontend changes
2. Edit `functions/index.js` for backend changes
3. Emulators auto-reload when you save
4. Test your changes in the browser

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development workflow.

## 🚀 Deployment

### Automatic Deployment (Recommended)

This template includes GitHub Actions workflows:

- ✅ **Push to `main`** → Automatic production deployment
- ✅ **Open a PR** → Automatic preview deployment with unique URL
- ✅ **Close PR** → Preview automatically cleaned up

**First time?** You need to set up a `FIREBASE_TOKEN` secret. See **[SETUP.md](SETUP.md)** Step 10-11.

### Manual Deployment

```bash
# Deploy everything
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

## 🔐 GitHub Actions Setup

To enable automatic deployments, you need to configure one secret:

### ⚠️ Required Secret for CI/CD

| Secret Name | Description | How to Get It |
|------------|-------------|---------------|
| `FIREBASE_TOKEN` | Authentication token for Firebase CLI | Run `firebase login:ci` in your terminal |

### 📝 Step-by-Step: Adding the Secret

**This is the #1 setup issue - follow these steps carefully:**

1. **Generate the token** in your terminal:
   ```bash
   firebase login:ci
   ```
   This will:
   - Open your browser to authenticate
   - Display a token like `1//abc123def456...`
   - **Copy this token!**

2. **Add to GitHub** (don't close your terminal yet!):
   - Go to your repository on GitHub.com
   - Click **Settings** (repository settings)
   - Click **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `FIREBASE_TOKEN`
   - Value: Paste the token from step 1
   - Click **Add secret**

3. **Verify it works**:
   - Go to **Actions** tab
   - Look for any workflow runs
   - If you see ✅ green checks, you're good!
   - If you see ❌ red X's, check the logs

**Visual Guide**: See [SETUP.md](SETUP.md#step-10-generate-firebase-token) for detailed screenshots and troubleshooting.

**Still having issues?** Check the [Troubleshooting section](SETUP.md#-troubleshooting) or [open an issue](https://github.com/aarons22/fpl-tool/issues/new?template=setup-help.md).

## 🏗️ Project Structure

```
.
├── public/              # Frontend code
│   ├── index.html       # Main HTML file
│   ├── app.js           # JavaScript application logic
│   ├── styles.css       # Styles
│   ├── sw.js            # Service worker (PWA)
│   └── manifest.json    # PWA manifest
├── functions/           # Backend code
│   ├── index.js         # Cloud Functions
│   └── package.json     # Backend dependencies
├── .github/
│   └── workflows/       # CI/CD workflows
├── firebase.json        # Firebase configuration
├── firestore.rules      # Database security rules
├── SETUP.md            # First-time setup guide
└── DEVELOPMENT.md      # Development guide
```

## 🧪 Testing

### Test Cloud Functions Locally

```bash
# Start emulators
firebase emulators:start

# In another terminal, test the functions
curl http://localhost:5001/YOUR-PROJECT-ID/us-central1/helloWorld

curl -X POST http://localhost:5001/YOUR-PROJECT-ID/us-central1/getData \
  -H "Content-Type: application/json" \
  -d '{"name": "World"}'
```

### Linting

```bash
cd functions
npm run lint        # Check for issues
npm run lint -- --fix  # Auto-fix issues
```

## 🐛 Troubleshooting

### Common Issues

**Q: GitHub Actions failing with "FIREBASE_TOKEN is not set"**
- A: Add the `FIREBASE_TOKEN` secret in repository settings. See [SETUP.md](SETUP.md#step-11-add-token-to-github-secrets)

**Q: "Permission denied" when deploying**
- A: Run `firebase login` to re-authenticate

**Q: Emulators won't start**
- A: Install Java 21+ (required for Firebase emulators)

**Q: Functions not working in production**
- A: Enable billing in Firebase Console (required for Cloud Functions)

**More troubleshooting**: See [SETUP.md](SETUP.md#-troubleshooting)

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`cd functions && npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Workflow

- All PRs get automatic preview deployments
- Code must pass linting before merging
- Follow the existing code style
- Update documentation if needed

## 📄 License

ISC License - feel free to use this template for your projects!

## 🌟 Show Your Support

If this template helped you, consider:
- ⭐ Starring this repository
- 🐛 Reporting bugs or requesting features
- 📖 Improving documentation
- 🔀 Contributing code

## 📞 Support & Resources

- **Setup Issues?** → [SETUP.md](SETUP.md#-troubleshooting)
- **Development Questions?** → [DEVELOPMENT.md](DEVELOPMENT.md)
- **Firebase Docs** → [firebase.google.com/docs](https://firebase.google.com/docs)
- **GitHub Actions** → [docs.github.com/actions](https://docs.github.com/en/actions)

---

**Ready to get started?** 👉 Go to [SETUP.md](SETUP.md)

Made with ❤️ for developers who want to ship fast

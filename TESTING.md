# Testing Guide for FPL Tool

This guide explains how to test the FPL Tool locally and in production.

## Prerequisites for Local Testing

1. **Node.js 20+** installed
2. **Java 21+** installed (for Firebase emulators)
3. **Firebase CLI** installed: `npm install -g firebase-tools@13.0.0`
4. **API Keys**:
   - Odds API key from [the-odds-api.com](https://the-odds-api.com/) (optional but recommended)

## Local Testing with Firebase Emulators

### Step 1: Set Up Environment Variables

Create a `.env.local` file in the `functions/` directory:

```bash
cd functions
cp .env.local.example .env.local
```

Edit `.env.local` and add your Odds API key:
```bash
ODDS_API_KEY=your-actual-api-key-here
```

**Note:** If you don't have an Odds API key, you can still test the FPL functions (which don't require a key).

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install functions dependencies
cd functions
npm install
cd ..
```

### Step 3: Start Firebase Emulators

```bash
firebase emulators:start
```

This will start:
- **Hosting**: http://localhost:5000 (Frontend)
- **Functions**: http://localhost:5001/fpl-tool-dfb38/us-central1/{function_name}
- **Emulator UI**: http://localhost:4000 (Visual interface)

### Step 4: Test the Frontend

Open http://localhost:5000 in your browser and:

1. Click **"Test FPL API"** button
   - Should fetch FPL bootstrap data
   - Should show: "FPL API working! Found XXX players across 20 teams"

2. Click **"Test Odds API"** button
   - If you have an API key: Should show "Odds API working! Found XX available sports"
   - Without API key: Shows "Odds API key not configured" error (expected)

### Step 5: Test Individual Functions

With emulators running, test each function using curl:

#### FPL Functions (No API key needed)

**Test getFPLBootstrap:**
```bash
curl http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLBootstrap
```
Expected: JSON with players, teams, gameweeks data

**Test getFPLFixtures:**
```bash
curl http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLFixtures
```
Expected: JSON with all fixtures

**Test getFPLFixtures for specific gameweek:**
```bash
curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLFixtures?event=1"
```
Expected: JSON with gameweek 1 fixtures only

**Test getFPLPlayer:**
```bash
curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLPlayer?id=1"
```
Expected: JSON with player history and fixtures

**Test getFPLLiveGameweek:**
```bash
curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLLiveGameweek?event=1"
```
Expected: JSON with live gameweek data

#### Odds API Functions (Requires API key)

**Test getAvailableSports:**
```bash
curl http://localhost:5001/fpl-tool-dfb38/us-central1/getAvailableSports
```
Expected: JSON with available sports list

**Test getSportsOdds (Premier League):**
```bash
curl http://localhost:5001/fpl-tool-dfb38/us-central1/getSportsOdds
```
Expected: JSON with Premier League odds

**Test getSportsOdds with parameters:**
```bash
curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getSportsOdds?sport=soccer_epl&regions=uk&oddsFormat=decimal"
```
Expected: JSON with EPL odds in decimal format

## Production Testing

After deployment to Firebase, replace `localhost:5001/fpl-tool-dfb38/us-central1` with:
`https://us-central1-fpl-tool-dfb38.cloudfunctions.net`

Example:
```bash
curl https://us-central1-fpl-tool-dfb38.cloudfunctions.net/getFPLBootstrap
```

## Expected Responses

### Success Response Format
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Common Issues and Solutions

### Issue: "ODDS_API_KEY environment variable is not set"
**Solution:** Create `functions/.env.local` with your API key (see Step 1)

### Issue: "Failed to fetch FPL data"
**Solution:** 
- Check your internet connection
- FPL API might be down (try again later)
- Check the logs for more details

### Issue: Functions not loading
**Solution:**
```bash
cd functions
npm install
firebase emulators:start
```

### Issue: Emulators won't start
**Solutions:**
1. Check Java is installed: `java -version` (need 21+)
2. Check ports 5000, 5001, 4000 are available
3. Try: `firebase emulators:start --only functions,hosting`

### Issue: "Blocked by DNS monitoring proxy" when starting emulators
**Solution:**
This happens in CI environments or restricted networks. The emulator UI download is blocked but not critical:
1. The functions can still be tested programmatically
2. Use curl commands to test endpoints directly
3. Or test in production after deployment

## Linting

Before committing, always lint your code:

```bash
cd functions
npm run lint

# Auto-fix issues:
npm run lint -- --fix
```

## Automated Testing

The GitHub Actions workflows will automatically:
1. Install dependencies
2. Lint the code
3. Deploy to preview channel (for PRs)
4. Deploy to production (when merged to main)

Check workflow runs at: https://github.com/aarons22/fpl-tool/actions

## Manual Deployment

Deploy everything:
```bash
firebase deploy
```

Deploy specific services:
```bash
firebase deploy --only hosting
firebase deploy --only functions
```

## API Rate Limits

**FPL API:**
- No official rate limits
- Be respectful (cache data when possible)

**Odds API:**
- Free tier: 500 requests/month
- Monitor usage at https://the-odds-api.com/account/

## Debugging Tips

1. **Check function logs:**
   ```bash
   firebase functions:log
   ```

2. **Test with verbose output:**
   ```bash
   curl -v http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLBootstrap
   ```

3. **Check emulator logs:**
   Look at the terminal running `firebase emulators:start` for real-time logs

4. **Validate JSON responses:**
   Use `jq` to pretty-print:
   ```bash
   curl http://localhost:5001/.../getFPLBootstrap | jq
   ```

## Next Steps

After testing locally:
1. Commit your changes
2. Create a Pull Request
3. GitHub Actions will create a preview deployment
4. Test the preview URL
5. Merge to main to deploy to production

## Additional Resources

- [API Documentation](API.md) - Complete API reference
- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [FPL API Guide](https://www.oliverlooney.com/blogs/FPL-APIs-Explained)
- [The Odds API Docs](https://the-odds-api.com/liveapi/guides/v4/)

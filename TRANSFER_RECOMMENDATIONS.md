# Transfer Recommendations Feature

## Overview

This feature provides optimal transfer recommendations for Fantasy Premier League (FPL) managers based on:
- Current team composition
- Available free transfers
- Bank balance
- Player odds (when available)
- FPL scoring system

## Implementation Details

### Cloud Function: `getTransferRecommendations`

**Location:** `functions/index.js:600-893`

**Endpoint:** `POST /getTransferRecommendations`

**Request Body:**
```json
{
  "teamId": "123456",
  "transfersRemaining": 1,
  "bankBalance": 5.0,
  "currentGameweek": 10
}
```

### Scoring System

The recommendation algorithm uses FPL's official scoring system:

| Action | Points |
|--------|--------|
| Midfielder goal | 5 |
| Forward goal | 4 |
| Defender/GK goal | 6 |
| Assist (any position) | 3 |
| Clean sheet (DEF/GK) | 4 |

### Expected Points Calculation

1. **Base Score:** Uses player form from FPL API
2. **Odds Integration (Optional):** If `ODDS_API_KEY` is configured:
   - Converts decimal odds to probability (1 / odds)
   - Calculates expected points: probability × points for action
   - Includes markets: `player_anytime_goalscorer`, `player_assists`
3. **Clean Sheets:** Uses historical clean sheet stats for defenders/goalkeepers
4. **Value Score:** Points per million (cost efficiency metric)

### Recommendation Logic

The algorithm:
1. Fetches all players from FPL API
2. Fetches current team picks for specified gameweek
3. Calculates expected points for all players
4. Finds transfer opportunities by:
   - Matching positions (e.g., MID → MID only)
   - Checking budget constraints
   - Calculating points gain
5. Sorts by expected points gain (descending)
6. Returns top N recommendations based on transfers remaining

## Frontend Implementation

### UI Components

**Location:** `public/index.html:74-116`

Form fields:
- **Team ID:** FPL manager's entry ID
- **Free Transfers:** Number of available transfers (0-15)
- **Bank Balance:** Available budget in £m
- **Gameweek:** Optional, defaults to current

### JavaScript Functions

**Location:** `public/app.js:204-343`

Key functions:
- `getTransferRecommendations()`: Handles form submission and API call
- `displayRecommendations()`: Renders results with player cards

### Styling

**Location:** `public/styles.css:537-704`

Responsive design with:
- Transfer cards with player-in/player-out layout
- Grid layout (desktop) → column layout (mobile)
- Color-coded points gain badges
- Metadata display for team info

## Testing Guide

### Local Testing with Emulators

1. **Start Firebase Emulators:**
   ```bash
   firebase emulators:start
   ```

2. **Test the Cloud Function:**
   ```bash
   curl -X POST http://localhost:5001/fpl-tool-dfb38/us-central1/getTransferRecommendations \
     -H "Content-Type: application/json" \
     -d '{
       "teamId": "123456",
       "transfersRemaining": 1,
       "bankBalance": 5.0
     }'
   ```

3. **Test via Web UI:**
   - Open http://localhost:5000
   - Fill in the Transfer Recommendations form
   - Submit to see recommendations

### Test Cases

#### Valid Request
```json
{
  "teamId": "123456",
  "transfersRemaining": 1,
  "bankBalance": 5.0
}
```
Expected: 200 OK with recommendations array

#### Missing Required Field
```json
{
  "teamId": "123456",
  "transfersRemaining": 1
}
```
Expected: 400 Bad Request with error message

#### Invalid Team ID
```json
{
  "teamId": "999999999",
  "transfersRemaining": 1,
  "bankBalance": 5.0
}
```
Expected: 500 Internal Server Error (FPL API returns error)

#### No Beneficial Transfers
Team with optimal players may return empty recommendations array

## Environment Variables

### Optional: ODDS_API_KEY

For enhanced predictions with betting odds integration:

1. **Local Development:**
   ```bash
   # In functions/.env.local
   ODDS_API_KEY=your-api-key-here
   ```

2. **Production (GitHub Actions):**
   - Add `ODDS_API_KEY` as a GitHub Secret
   - Automatically deployed via CI/CD

## Known Limitations

1. **Player Name Matching:** Odds API uses full names, FPL uses web_name. Current implementation uses simple string matching which may miss some players.

2. **Clean Sheet Odds:** Not directly available from current odds markets. Uses historical stats as proxy.

3. **Budget Calculation:** Uses provided bank balance. Real-time budget should be fetched from FPL API for production use.

4. **Multiple Transfers:** Algorithm considers transfers independently, not as a package (e.g., doesn't optimize for 2-3 transfer combos).

## Future Enhancements

1. **Improved Name Matching:** Fuzzy matching or player ID mapping for odds data
2. **Multi-Transfer Optimization:** Consider transfer packages (e.g., best 2-transfer combo)
3. **Fixture Difficulty:** Factor in upcoming fixture difficulty ratings
4. **Injury/Suspension Checking:** Exclude unavailable players
5. **Captain Recommendations:** Suggest optimal captain picks
6. **Wildcard Optimization:** Full team optimization for wildcard chips

## API Documentation

See `API.md` section 11 for complete endpoint documentation.

## Files Modified

- `functions/index.js` - Cloud Function implementation
- `public/index.html` - UI form and results container
- `public/app.js` - Frontend JavaScript logic
- `public/styles.css` - Transfer recommendation styling
- `API.md` - Endpoint documentation

# FPL Tool API Documentation

This document describes the Cloud Functions available in the FPL Tool.

## Base URLs

### Local Development (Emulators)
```
http://localhost:5001/fpl-tool-dfb38/us-central1/{function_name}
```

### Production
```
https://us-central1-fpl-tool-dfb38.cloudfunctions.net/{function_name}
```

## Fantasy Premier League API Functions

### 1. getFPLBootstrap

Fetches the complete bootstrap-static data from FPL API including all players, teams, gameweeks, and general game information.

**Endpoint:** `GET /getFPLBootstrap`

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [...],        // All gameweeks
    "teams": [...],         // All Premier League teams
    "elements": [...],      // All players
    "element_types": [...], // Player positions (GK, DEF, MID, FWD)
    "game_settings": {...}  // Game rules and settings
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Example (Local):**
```bash
curl http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLBootstrap
```

**Example (Production):**
```bash
curl https://us-central1-fpl-tool-dfb38.cloudfunctions.net/getFPLBootstrap
```

---

### 2. getFPLFixtures

Fetches match fixtures from FPL API, optionally filtered by gameweek.

**Endpoint:** `GET /getFPLFixtures?event={gameweek}`

**Query Parameters:**
- `event` (optional): Gameweek number (e.g., `1`, `2`, `38`)

**Response:**
```json
{
  "success": true,
  "fixtures": [
    {
      "id": 1,
      "event": 1,
      "team_h": 1,
      "team_a": 2,
      "kickoff_time": "2024-08-10T14:00:00Z",
      "team_h_score": null,
      "team_a_score": null
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Examples:**
```bash
# All fixtures
curl http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLFixtures

# Fixtures for gameweek 1
curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLFixtures?event=1"
```

---

### 3. getFPLPlayer

Fetches detailed information for a specific player including history, fixtures, and past seasons.

**Endpoint:** `GET /getFPLPlayer?id={player_id}`

**Query Parameters:**
- `id` (required): Player ID (from bootstrap data)

**Response:**
```json
{
  "success": true,
  "player": {
    "history": [...],       // Past gameweek performances
    "fixtures": [...],      // Upcoming fixtures
    "history_past": [...]   // Past season summaries
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Example:**
```bash
curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLPlayer?id=1"
```

---

### 4. getFPLLiveGameweek

Fetches live gameweek data including real-time player statistics during matches.

**Endpoint:** `GET /getFPLLiveGameweek?event={gameweek}`

**Query Parameters:**
- `event` (required): Gameweek number

**Response:**
```json
{
  "success": true,
  "liveData": {
    "elements": [
      {
        "id": 1,
        "stats": {
          "minutes": 90,
          "goals_scored": 1,
          "assists": 0,
          "bonus": 3
        }
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Example:**
```bash
curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLLiveGameweek?event=1"
```

---

### 5. getFPLTeam

Fetches a Fantasy Premier League manager's team information by entry ID.

**Endpoint:** `GET /getFPLTeam?id={entry_id}`

**Query Parameters:**
- `id` (required): Manager's entry ID (team ID)

**Response:**
```json
{
  "success": true,
  "team": {
    "id": 123456,
    "name": "My FPL Team",
    "player_first_name": "John",
    "player_last_name": "Doe",
    "summary_overall_points": 1234,
    "summary_overall_rank": 50000,
    "current_event": 10,
    "leagues": {...}
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Example:**
```bash
curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLTeam?id=123456"
```

---

### 6. getFPLTeamPicks

Fetches a manager's team selections (squad) for a specific gameweek.

**Endpoint:** `GET /getFPLTeamPicks?id={entry_id}&event={gameweek}`

**Query Parameters:**
- `id` (required): Manager's entry ID
- `event` (required): Gameweek number

**Response:**
```json
{
  "success": true,
  "picks": {
    "active_chip": null,
    "automatic_subs": [],
    "entry_history": {
      "event": 1,
      "points": 85,
      "total_points": 85,
      "rank": 123456
    },
    "picks": [
      {
        "element": 123,
        "position": 1,
        "is_captain": true,
        "is_vice_captain": false,
        "multiplier": 2
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Example:**
```bash
curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLTeamPicks?id=123456&event=1"
```

---

### 7. getFPLTeamTransfers

Fetches a manager's transfer history.

**Endpoint:** `GET /getFPLTeamTransfers?id={entry_id}`

**Query Parameters:**
- `id` (required): Manager's entry ID

**Response:**
```json
{
  "success": true,
  "transfers": [
    {
      "element_in": 234,
      "element_in_cost": 85,
      "element_out": 123,
      "element_out_cost": 80,
      "entry": 123456,
      "event": 2,
      "time": "2024-08-18T10:30:00Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Example:**
```bash
curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLTeamTransfers?id=123456"
```

---

## The Odds API Functions (Player Props)

### 8. getPlayerPropsOdds

Fetches player-level betting odds for goals, assists, and other player props.

**Endpoint:** `GET /getPlayerPropsOdds?sport={sport_key}&regions={regions}&markets={markets}`

**Query Parameters:**
- `sport` (optional): Sport key (default: `soccer_epl`)
- `regions` (optional): Bookmaker regions (default: `uk`). Options: `us`, `uk`, `eu`, `au`
- `oddsFormat` (optional): Odds format (default: `decimal`). Options: `decimal`, `american`
- `markets` (optional): Comma-separated player prop markets (default: `player_goal_scorer,player_assists`)
  - Available markets: `player_goal_scorer`, `player_assists`, `player_anytime_goalscorer`, `player_shots`, `player_shots_on_target`

**Response:**
```json
{
  "success": true,
  "sport": "soccer_epl",
  "markets": "player_goal_scorer,player_assists",
  "odds": [
    {
      "id": "abc123",
      "sport_key": "soccer_epl",
      "commence_time": "2024-08-10T14:00:00Z",
      "home_team": "Arsenal",
      "away_team": "Manchester United",
      "bookmakers": [
        {
          "key": "bet365",
          "title": "Bet365",
          "markets": [
            {
              "key": "player_goal_scorer",
              "outcomes": [
                {"name": "Mohamed Salah", "description": "Anytime Goalscorer", "price": 2.50},
                {"name": "Erling Haaland", "description": "Anytime Goalscorer", "price": 1.85}
              ]
            }
          ]
        }
      ]
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Examples:**
```bash
# Player goals and assists (default)
curl http://localhost:5001/fpl-tool-dfb38/us-central1/getPlayerPropsOdds

# Specific markets
curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getPlayerPropsOdds?sport=soccer_epl&regions=uk&markets=player_goal_scorer,player_assists"

# Anytime goalscorer odds
curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getPlayerPropsOdds?markets=player_anytime_goalscorer"
```

**Note:** Requires `ODDS_API_KEY` environment variable to be set.

---

### 9. getCleanSheetOdds

Fetches clean sheet odds for teams and goalkeepers.

**Endpoint:** `GET /getCleanSheetOdds?sport={sport_key}&regions={regions}`

**Query Parameters:**
- `sport` (optional): Sport key (default: `soccer_epl`)
- `regions` (optional): Bookmaker regions (default: `uk`)
- `oddsFormat` (optional): Odds format (default: `decimal`)

**Response:**
```json
{
  "success": true,
  "sport": "soccer_epl",
  "markets": "btts,team_totals",
  "odds": [
    {
      "id": "abc123",
      "sport_key": "soccer_epl",
      "commence_time": "2024-08-10T14:00:00Z",
      "home_team": "Arsenal",
      "away_team": "Manchester United",
      "bookmakers": [
        {
          "key": "bet365",
          "title": "Bet365",
          "markets": [
            {
              "key": "btts",
              "outcomes": [
                {"name": "Yes", "price": 1.70},
                {"name": "No", "price": 2.10}
              ]
            }
          ]
        }
      ]
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Example:**
```bash
curl http://localhost:5001/fpl-tool-dfb38/us-central1/getCleanSheetOdds
```

**Note:** Requires `ODDS_API_KEY` environment variable to be set. BTTS (Both Teams To Score) "No" indicates a clean sheet likelihood.

---

### 10. getAvailableSports

Fetches the list of available sports from The Odds API.

**Endpoint:** `GET /getAvailableSports`

**Response:**
```json
{
  "success": true,
  "sports": [
    {
      "key": "soccer_epl",
      "group": "Soccer",
      "title": "EPL",
      "description": "English Premier League",
      "active": true,
      "has_outrights": false
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Example:**
```bash
curl http://localhost:5001/fpl-tool-dfb38/us-central1/getAvailableSports
```

**Note:** Requires `ODDS_API_KEY` environment variable to be set.

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

**Common Error Codes:**
- `400` - Bad Request (missing required parameters)
- `500` - Internal Server Error (API call failed, configuration issue)

---

## Environment Configuration

### Required Environment Variables

#### For Odds API Functions:
- `ODDS_API_KEY` - Your API key from [the-odds-api.com](https://the-odds-api.com/)

### Local Development Setup

1. Copy the example environment file:
   ```bash
   cp functions/.env.local.example functions/.env.local
   ```

2. Edit `functions/.env.local` and add your API key:
   ```bash
   ODDS_API_KEY=your-actual-api-key-here
   ```

3. Start the emulators:
   ```bash
   firebase emulators:start
   ```

### Production Setup (GitHub Actions)

Add the following secret to your GitHub repository:
- **Secret Name:** `ODDS_API_KEY`
- **Secret Value:** Your Odds API key

Go to: Repository Settings → Secrets and variables → Actions → New repository secret

---

## Rate Limits

### Fantasy Premier League API
- No official rate limits documented
- Be respectful with requests
- Cache data when possible

### The Odds API
- Free tier: 500 requests/month
- Paid tiers available
- Check your usage at [the-odds-api.com](https://the-odds-api.com/)

---

## Testing

### Test All Functions Locally

1. Start emulators:
   ```bash
   firebase emulators:start
   ```

2. Test FPL functions:
   ```bash
   # Bootstrap data
   curl http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLBootstrap
   
   # Fixtures
   curl http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLFixtures
   
   # Player data
   curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLPlayer?id=1"
   
   # Live gameweek
   curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLLiveGameweek?event=1"
   
   # Team info by entry ID
   curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLTeam?id=123456"
   
   # Team picks for gameweek
   curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLTeamPicks?id=123456&event=1"
   
   # Transfer history
   curl "http://localhost:5001/fpl-tool-dfb38/us-central1/getFPLTeamTransfers?id=123456"
   ```

3. Test Odds API functions (requires API key):
   ```bash
   # Available sports
   curl http://localhost:5001/fpl-tool-dfb38/us-central1/getAvailableSports
   
   # Player prop odds (goals, assists)
   curl http://localhost:5001/fpl-tool-dfb38/us-central1/getPlayerPropsOdds
   
   # Clean sheet odds
   curl http://localhost:5001/fpl-tool-dfb38/us-central1/getCleanSheetOdds
   ```

---

## Additional Resources

- **FPL API Guide:** [Oliver Looney's FPL API Explained](https://www.oliverlooney.com/blogs/FPL-APIs-Explained)
- **The Odds API Docs:** [Official Documentation](https://the-odds-api.com/liveapi/guides/v4/)
- **Firebase Functions:** [Google Cloud Functions Docs](https://firebase.google.com/docs/functions)

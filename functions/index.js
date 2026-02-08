// Firebase Cloud Functions
// FPL Tool - Fantasy Premier League Analytics with Odds Integration

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// CORS configuration for web requests
const cors = require('cors')({origin: true});

// API Base URLs
const FPL_API_BASE = 'https://fantasy.premierleague.com/api';
const ODDS_API_BASE = 'https://api.the-odds-api.com/v4';

/**
 * Cloud Function: getFPLBootstrap
 *
 * Fetches the bootstrap-static data from FPL API
 * This includes all players, teams, gameweeks, and general game info
 *
 * Request: GET /getFPLBootstrap
 *
 * Response:
 * {
 *   "events": [...],      // Gameweeks
 *   "teams": [...],       // Premier League teams
 *   "elements": [...],    // All players
 *   "element_types": [...] // Player positions
 * }
 */
exports.getFPLBootstrap = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      console.log('getFPLBootstrap function called');

      const fetch = (await import('node-fetch')).default;
      const apiResponse = await fetch(`${FPL_API_BASE}/bootstrap-static/`);

      if (!apiResponse.ok) {
        throw new Error(`FPL API returned ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      return response.status(200).json({
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in getFPLBootstrap:', error);
      return response.status(500).json({
        success: false,
        error: 'Failed to fetch FPL bootstrap data',
        message: error.message,
      });
    }
  });
});

/**
 * Cloud Function: getFPLFixtures
 *
 * Fetches fixtures from FPL API
 * Optionally filter by gameweek
 *
 * Request: GET /getFPLFixtures?event={gameweek}
 *
 * Response:
 * {
 *   "fixtures": [...]
 * }
 */
exports.getFPLFixtures = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      console.log('getFPLFixtures function called');

      const event = request.query.event;
      let url = `${FPL_API_BASE}/fixtures/`;
      if (event) {
        url += `?event=${event}`;
      }

      const fetch = (await import('node-fetch')).default;
      const apiResponse = await fetch(url);

      if (!apiResponse.ok) {
        throw new Error(`FPL API returned ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      return response.status(200).json({
        success: true,
        fixtures: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in getFPLFixtures:', error);
      return response.status(500).json({
        success: false,
        error: 'Failed to fetch FPL fixtures',
        message: error.message,
      });
    }
  });
});

/**
 * Cloud Function: getFPLPlayer
 *
 * Fetches detailed player information from FPL API
 *
 * Request: GET /getFPLPlayer?id={player_id}
 *
 * Response:
 * {
 *   "history": [...],      // Past gameweek performances
 *   "fixtures": [...],     // Upcoming fixtures
 *   "history_past": [...]  // Past seasons
 * }
 */
exports.getFPLPlayer = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      const playerId = request.query.id;

      if (!playerId) {
        return response.status(400).json({
          success: false,
          error: 'Player ID is required',
          message: 'Please provide player ID in query parameter: ?id=123',
        });
      }

      console.log('getFPLPlayer called for player:', playerId);

      const fetch = (await import('node-fetch')).default;
      const apiResponse = await fetch(
          `${FPL_API_BASE}/element-summary/${playerId}/`,
      );

      if (!apiResponse.ok) {
        throw new Error(`FPL API returned ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      return response.status(200).json({
        success: true,
        player: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in getFPLPlayer:', error);
      return response.status(500).json({
        success: false,
        error: 'Failed to fetch player data',
        message: error.message,
      });
    }
  });
});

/**
 * Cloud Function: getFPLLiveGameweek
 *
 * Fetches live gameweek data from FPL API
 *
 * Request: GET /getFPLLiveGameweek?event={gameweek}
 *
 * Response:
 * {
 *   "elements": [...]  // Live player stats for the gameweek
 * }
 */
exports.getFPLLiveGameweek = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      const event = request.query.event;

      if (!event) {
        return response.status(400).json({
          success: false,
          error: 'Gameweek event ID is required',
          message: 'Please provide event ID in query parameter: ?event=1',
        });
      }

      console.log('getFPLLiveGameweek called for event:', event);

      const fetch = (await import('node-fetch')).default;
      const apiResponse = await fetch(`${FPL_API_BASE}/event/${event}/live/`);

      if (!apiResponse.ok) {
        throw new Error(`FPL API returned ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      return response.status(200).json({
        success: true,
        liveData: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in getFPLLiveGameweek:', error);
      return response.status(500).json({
        success: false,
        error: 'Failed to fetch live gameweek data',
        message: error.message,
      });
    }
  });
});

/**
 * Cloud Function: getFPLTeam
 *
 * Fetches a Fantasy Premier League manager's team information
 *
 * Request: GET /getFPLTeam?id={entry_id}
 *
 * Response:
 * {
 *   "team": {...}  // Manager's team details, points, rankings
 * }
 */
exports.getFPLTeam = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      const entryId = request.query.id;

      if (!entryId) {
        return response.status(400).json({
          success: false,
          error: 'Entry ID is required',
          message: 'Please provide entry ID in query parameter: ?id=123456',
        });
      }

      console.log('getFPLTeam called for entry:', entryId);

      const fetch = (await import('node-fetch')).default;
      const apiResponse = await fetch(
          `${FPL_API_BASE}/entry/${entryId}/`,
      );

      if (!apiResponse.ok) {
        throw new Error(`FPL API returned ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      return response.status(200).json({
        success: true,
        team: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in getFPLTeam:', error);
      return response.status(500).json({
        success: false,
        error: 'Failed to fetch FPL team data',
        message: error.message,
      });
    }
  });
});

/**
 * Cloud Function: getFPLTeamPicks
 *
 * Fetches a manager's team picks for a specific gameweek
 *
 * Request: GET /getFPLTeamPicks?id={entry_id}&event={gameweek}
 *
 * Response:
 * {
 *   "picks": {
 *     "active_chip": null,
 *     "automatic_subs": [...],
 *     "entry_history": {...},
 *     "picks": [...]  // Squad with captain, bench, positions
 *   }
 * }
 */
exports.getFPLTeamPicks = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      const entryId = request.query.id;
      const eventId = request.query.event;

      if (!entryId) {
        return response.status(400).json({
          success: false,
          error: 'Entry ID is required',
          message: 'Please provide entry ID: ?id=123456&event=1',
        });
      }

      if (!eventId) {
        return response.status(400).json({
          success: false,
          error: 'Event ID is required',
          message: 'Please provide gameweek event ID: ?id=123456&event=1',
        });
      }

      console.log('getFPLTeamPicks called for entry:', entryId, 'event:', eventId);

      const fetch = (await import('node-fetch')).default;
      const apiResponse = await fetch(
          `${FPL_API_BASE}/entry/${entryId}/event/${eventId}/picks/`,
      );

      if (!apiResponse.ok) {
        throw new Error(`FPL API returned ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      return response.status(200).json({
        success: true,
        picks: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in getFPLTeamPicks:', error);
      return response.status(500).json({
        success: false,
        error: 'Failed to fetch team picks',
        message: error.message,
      });
    }
  });
});

/**
 * Cloud Function: getFPLTeamTransfers
 *
 * Fetches a manager's transfer history
 *
 * Request: GET /getFPLTeamTransfers?id={entry_id}
 *
 * Response:
 * {
 *   "transfers": [...]  // All transfers made by the manager
 * }
 */
exports.getFPLTeamTransfers = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      const entryId = request.query.id;

      if (!entryId) {
        return response.status(400).json({
          success: false,
          error: 'Entry ID is required',
          message: 'Please provide entry ID in query parameter: ?id=123456',
        });
      }

      console.log('getFPLTeamTransfers called for entry:', entryId);

      const fetch = (await import('node-fetch')).default;
      const apiResponse = await fetch(
          `${FPL_API_BASE}/entry/${entryId}/transfers/`,
      );

      if (!apiResponse.ok) {
        throw new Error(`FPL API returned ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      return response.status(200).json({
        success: true,
        transfers: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in getFPLTeamTransfers:', error);
      return response.status(500).json({
        success: false,
        error: 'Failed to fetch transfer history',
        message: error.message,
      });
    }
  });
});

/**
 * Cloud Function: getPlayerPropsOdds
 *
 * Fetches player prop odds (goals, assists, clean sheets) from The Odds API
 *
 * Request: GET /getPlayerPropsOdds?sport={sport_key}&regions={regions}
 * Example: /getPlayerPropsOdds?sport=soccer_epl&regions=uk&
 *          markets=player_goal_scorer,player_assists
 *
 * Response:
 * {
 *   "odds": [...]  // Player prop odds from bookmakers
 * }
 */
exports.getPlayerPropsOdds = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      const sport = request.query.sport || 'soccer_epl';
      const regions = request.query.regions || 'uk';
      const oddsFormat = request.query.oddsFormat || 'decimal';
      // Player prop markets: player_goal_scorer, player_assists, player_anytime_goalscorer
      const markets = request.query.markets || 'player_goal_scorer,player_assists';

      // Get API key from environment
      const apiKey = process.env.ODDS_API_KEY;

      if (!apiKey) {
        return response.status(500).json({
          success: false,
          error: 'API key not configured',
          message: 'ODDS_API_KEY environment variable is not set',
        });
      }

      console.log('getPlayerPropsOdds called for sport:', sport, 'markets:', markets);

      const fetch = (await import('node-fetch')).default;
      const url = `${ODDS_API_BASE}/sports/${sport}/odds/?` +
                  `regions=${regions}&oddsFormat=${oddsFormat}&markets=${markets}&apiKey=${apiKey}`;

      const apiResponse = await fetch(url);

      if (!apiResponse.ok) {
        throw new Error(`Odds API returned ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      return response.status(200).json({
        success: true,
        sport: sport,
        markets: markets,
        odds: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in getPlayerPropsOdds:', error);
      return response.status(500).json({
        success: false,
        error: 'Failed to fetch player props odds',
        message: error.message,
      });
    }
  });
});

/**
 * Cloud Function: getCleanSheetOdds
 *
 * Fetches clean sheet odds for teams/goalkeepers from The Odds API
 *
 * Request: GET /getCleanSheetOdds?sport={sport_key}&regions={regions}
 *
 * Response:
 * {
 *   "odds": [...]  // Clean sheet odds from bookmakers
 * }
 */
exports.getCleanSheetOdds = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      const sport = request.query.sport || 'soccer_epl';
      const regions = request.query.regions || 'uk';
      const oddsFormat = request.query.oddsFormat || 'decimal';
      // Markets for clean sheets and defensive props
      const markets = 'btts,team_totals'; // Both teams to score (for clean sheet analysis)

      // Get API key from environment
      const apiKey = process.env.ODDS_API_KEY;

      if (!apiKey) {
        return response.status(500).json({
          success: false,
          error: 'API key not configured',
          message: 'ODDS_API_KEY environment variable is not set',
        });
      }

      console.log('getCleanSheetOdds called for sport:', sport);

      const fetch = (await import('node-fetch')).default;
      const url = `${ODDS_API_BASE}/sports/${sport}/odds/?` +
                  `regions=${regions}&oddsFormat=${oddsFormat}&markets=${markets}&apiKey=${apiKey}`;

      const apiResponse = await fetch(url);

      if (!apiResponse.ok) {
        throw new Error(`Odds API returned ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      return response.status(200).json({
        success: true,
        sport: sport,
        markets: markets,
        odds: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in getCleanSheetOdds:', error);
      return response.status(500).json({
        success: false,
        error: 'Failed to fetch clean sheet odds',
        message: error.message,
      });
    }
  });
});

/**
 * Cloud Function: getAvailableSports
 *
 * Fetches list of available sports from The Odds API
 *
 * Request: GET /getAvailableSports
 *
 * Response:
 * {
 *   "sports": [...]  // List of available sports
 * }
 */
exports.getAvailableSports = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      console.log('getAvailableSports function called');

      // Get API key from environment
      const apiKey = process.env.ODDS_API_KEY;

      if (!apiKey) {
        return response.status(500).json({
          success: false,
          error: 'API key not configured',
          message: 'ODDS_API_KEY environment variable is not set',
        });
      }

      const fetch = (await import('node-fetch')).default;
      const apiResponse = await fetch(
          `${ODDS_API_BASE}/sports/?apiKey=${apiKey}`,
      );

      if (!apiResponse.ok) {
        throw new Error(`Odds API returned ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      return response.status(200).json({
        success: true,
        sports: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in getAvailableSports:', error);
      return response.status(500).json({
        success: false,
        error: 'Failed to fetch available sports',
        message: error.message,
      });
    }
  });
});

/**
 * Cloud Function: helloWorld
 *
 * A simple example function that returns a greeting message
 *
 * Request: GET /helloWorld
 *
 * Response:
 * {
 *   "message": "Hello from Firebase!",
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 */
exports.helloWorld = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      console.log('helloWorld function called');

      return response.status(200).json({
        message: 'Hello from FPL Tool!',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in helloWorld:', error);
      return response.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  });
});

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
 * Cloud Function: getSportsOdds
 *
 * Fetches sports betting odds from The Odds API
 *
 * Request: GET /getSportsOdds?sport={sport_key}&regions={regions}
 * Example: /getSportsOdds?sport=soccer_epl&regions=uk
 *
 * Response:
 * {
 *   "odds": [...]  // Upcoming events with odds from bookmakers
 * }
 */
exports.getSportsOdds = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      const sport = request.query.sport || 'soccer_epl';
      const regions = request.query.regions || 'uk';
      const oddsFormat = request.query.oddsFormat || 'decimal';

      // Get API key from environment
      const apiKey = process.env.ODDS_API_KEY;

      if (!apiKey) {
        return response.status(500).json({
          success: false,
          error: 'API key not configured',
          message: 'ODDS_API_KEY environment variable is not set',
        });
      }

      console.log('getSportsOdds called for sport:', sport);

      const fetch = (await import('node-fetch')).default;
      const url = `${ODDS_API_BASE}/sports/${sport}/odds/?` +
                  `regions=${regions}&oddsFormat=${oddsFormat}&apiKey=${apiKey}`;

      const apiResponse = await fetch(url);

      if (!apiResponse.ok) {
        throw new Error(`Odds API returned ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      return response.status(200).json({
        success: true,
        sport: sport,
        odds: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in getSportsOdds:', error);
      return response.status(500).json({
        success: false,
        error: 'Failed to fetch sports odds',
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

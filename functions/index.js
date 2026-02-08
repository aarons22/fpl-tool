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
 * Cloud Function: getTransferRecommendations
 *
 * Recommends transfers based on current team, odds, and FPL points system
 *
 * Request: POST /getTransferRecommendations
 * Body:
 * {
 *   "teamId": "123456",
 *   "transfersRemaining": 1,
 *   "bankBalance": 5.0,
 *   "currentGameweek": 10
 * }
 *
 * Response:
 * {
 *   "recommendations": [...]
 * }
 */
exports.getTransferRecommendations = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      console.log('getTransferRecommendations function called');

      // Validate request method
      if (request.method !== 'POST') {
        return response.status(405).json({
          success: false,
          error: 'Method not allowed',
          message: 'Please use POST method',
        });
      }

      const {teamId, transfersRemaining, bankBalance, currentGameweek} = request.body;

      // Validate required parameters
      if (!teamId) {
        return response.status(400).json({
          success: false,
          error: 'Team ID is required',
          message: 'Please provide teamId in request body',
        });
      }

      if (transfersRemaining === undefined || transfersRemaining === null) {
        return response.status(400).json({
          success: false,
          error: 'Transfers remaining is required',
          message: 'Please provide transfersRemaining in request body',
        });
      }

      if (bankBalance === undefined || bankBalance === null) {
        return response.status(400).json({
          success: false,
          error: 'Bank balance is required',
          message: 'Please provide bankBalance in request body',
        });
      }

      console.log(`Analyzing team ${teamId} with ${transfersRemaining} transfers and £${bankBalance}m budget`);

      const fetch = (await import('node-fetch')).default;

      // Fetch bootstrap data (all players)
      const bootstrapResponse = await fetch(`${FPL_API_BASE}/bootstrap-static/`);
      if (!bootstrapResponse.ok) {
        throw new Error('Failed to fetch FPL bootstrap data');
      }
      const bootstrap = await bootstrapResponse.json();

      // Fetch current team picks
      const gameweek = currentGameweek || bootstrap.events.find((e) => e.is_current).id;
      const picksResponse = await fetch(`${FPL_API_BASE}/entry/${teamId}/event/${gameweek}/picks/`);
      if (!picksResponse.ok) {
        throw new Error('Failed to fetch team picks');
      }
      const picksData = await picksResponse.json();

      // Get API key for odds
      const oddsApiKey = process.env.ODDS_API_KEY;
      let oddsData = null;

      if (oddsApiKey) {
        try {
          // Fetch player odds (goals, assists, clean sheets)
          const oddsResponse = await fetch(
              `${ODDS_API_BASE}/sports/soccer_epl/odds/?` +
              `regions=uk&oddsFormat=decimal&markets=player_anytime_goalscorer,player_assists&apiKey=${oddsApiKey}`,
          );
          if (oddsResponse.ok) {
            oddsData = await oddsResponse.json();
          }
        } catch (oddsError) {
          console.warn('Could not fetch odds data:', oddsError.message);
        }
      }

      // Calculate expected points for all players
      const playerScores = calculatePlayerExpectedPoints(
          bootstrap.elements,
          bootstrap.element_types,
          oddsData,
      );

      // Get current team player IDs
      const currentPlayerIds = picksData.picks.map((pick) => pick.element);

      // Calculate recommendations
      const recommendations = generateTransferRecommendations(
          currentPlayerIds,
          playerScores,
          bootstrap.elements,
          bootstrap.element_types,
          transfersRemaining,
          bankBalance,
          picksData.entry_history.bank,
      );

      return response.status(200).json({
        success: true,
        recommendations: recommendations,
        metadata: {
          teamId: teamId,
          gameweek: gameweek,
          transfersRemaining: transfersRemaining,
          bankBalance: bankBalance,
          oddsAvailable: !!oddsData,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in getTransferRecommendations:', error);
      return response.status(500).json({
        success: false,
        error: 'Failed to generate transfer recommendations',
        message: error.message,
      });
    }
  });
});

/**
 * Calculate expected points for all players based on odds and FPL scoring system
 *
 * Scoring:
 * - Midfielder goal: 5 points
 * - Forward goal: 4 points
 * - Defender goal: 6 points
 * - Assist: 3 points
 * - Clean sheet (defender/goalkeeper): 4 points
 *
 * @param {Array} players - Array of player objects from FPL API
 * @param {Array} elementTypes - Array of position types
 * @param {Object|null} oddsData - Odds data from The Odds API (optional)
 * @return {Object} Object mapping player IDs to their score data
 */
function calculatePlayerExpectedPoints(players, elementTypes, oddsData) {
  const playerScores = {};

  // Position ID mapping: 1=GK, 2=DEF, 3=MID, 4=FWD
  const positionPoints = {
    1: {goal: 6, assist: 3, cleanSheet: 4}, // GK
    2: {goal: 6, assist: 3, cleanSheet: 4}, // DEF
    3: {goal: 5, assist: 3, cleanSheet: 1}, // MID
    4: {goal: 4, assist: 3, cleanSheet: 0}, // FWD
  };

  players.forEach((player) => {
    const position = player.element_type;
    const points = positionPoints[position];

    // Base expected points from form and recent stats
    let expectedPoints = parseFloat(player.form) || 0;

    // Add points based on odds if available
    if (oddsData) {
      const playerOdds = findPlayerOdds(player, oddsData);
      if (playerOdds) {
        // Convert decimal odds to probability and calculate expected points
        if (playerOdds.goalOdds) {
          const goalProbability = 1 / playerOdds.goalOdds;
          expectedPoints += goalProbability * points.goal;
        }
        if (playerOdds.assistOdds) {
          const assistProbability = 1 / playerOdds.assistOdds;
          expectedPoints += assistProbability * points.assist;
        }
        // Note: Clean sheet odds would come from a different market
        // For now, we'll use defensive stats as a proxy
        if (position <= 2) { // GK or DEF
          const cleanSheetChance = parseFloat(player.clean_sheets_per_90) || 0;
          expectedPoints += (cleanSheetChance / 90) * points.cleanSheet;
        }
      }
    }

    playerScores[player.id] = {
      playerId: player.id,
      name: player.web_name,
      team: player.team,
      position: position,
      expectedPoints: expectedPoints,
      cost: player.now_cost / 10, // Convert from 0.1m units to actual millions
      valueScore: expectedPoints / (player.now_cost / 10), // Points per million
      form: player.form,
      selectedByPercent: player.selected_by_percent,
    };
  });

  return playerScores;
}

/**
 * Find odds for a specific player in the odds data
 *
 * @param {Object} player - Player object from FPL API
 * @param {Object} oddsData - Odds data from The Odds API
 * @return {Object|null} Object with goalOdds and assistOdds, or null if not found
 */
function findPlayerOdds(player, oddsData) {
  if (!oddsData || !Array.isArray(oddsData)) {
    return null;
  }

  // Player name matching is tricky - odds use full names, FPL uses web_name
  // This is a simplified version - production would need better name matching
  const playerName = player.web_name.toLowerCase();

  for (const event of oddsData) {
    if (!event.bookmakers) continue;

    for (const bookmaker of event.bookmakers) {
      if (!bookmaker.markets) continue;

      for (const market of bookmaker.markets) {
        if (!market.outcomes) continue;

        for (const outcome of market.outcomes) {
          if (outcome.name && outcome.name.toLowerCase().includes(playerName)) {
            const result = {};
            if (market.key === 'player_anytime_goalscorer') {
              result.goalOdds = outcome.price;
            } else if (market.key === 'player_assists') {
              result.assistOdds = outcome.price;
            }
            return result;
          }
        }
      }
    }
  }

  return null;
}

/**
 * Generate transfer recommendations
 *
 * @param {Array} currentPlayerIds - Array of player IDs in current team
 * @param {Object} playerScores - Object mapping player IDs to score data
 * @param {Array} allPlayers - Array of all players from FPL API
 * @param {Array} elementTypes - Array of position types
 * @param {number} transfersRemaining - Number of free transfers available
 * @param {number} bankBalance - Bank balance in millions
 * @param {number} actualBank - Actual bank balance from FPL API
 * @return {Array} Array of recommended transfers
 */
function generateTransferRecommendations(
    currentPlayerIds,
    playerScores,
    allPlayers,
    elementTypes,
    transfersRemaining,
    bankBalance,
    actualBank,
) {
  const recommendations = [];

  // Create a map of current players with their scores
  const currentPlayers = currentPlayerIds.map((id) => playerScores[id]).filter(Boolean);

  // Find available players (not in current team)
  const availablePlayers = Object.values(playerScores)
      .filter((player) => !currentPlayerIds.includes(player.playerId))
      .sort((a, b) => b.valueScore - a.valueScore); // Sort by value (points per million)

  // For each transfer slot, find best swap
  const transferOpportunities = [];

  for (const currentPlayer of currentPlayers) {
    for (const availablePlayer of availablePlayers) {
      // Check if positions match
      if (currentPlayer.position !== availablePlayer.position) {
        continue;
      }

      // Check if we can afford the transfer
      const costDiff = availablePlayer.cost - currentPlayer.cost;
      const availableBudget = (actualBank || bankBalance) / 10; // Convert to millions

      if (costDiff > availableBudget) {
        continue;
      }

      // Calculate expected points gain
      const pointsGain = availablePlayer.expectedPoints - currentPlayer.expectedPoints;

      // Only recommend if there's a positive points gain
      if (pointsGain > 0) {
        transferOpportunities.push({
          playerOut: currentPlayer,
          playerIn: availablePlayer,
          pointsGain: pointsGain,
          costChange: costDiff,
          valueImprovement: availablePlayer.valueScore - currentPlayer.valueScore,
        });
      }
    }
  }

  // Sort by points gain
  transferOpportunities.sort((a, b) => b.pointsGain - a.pointsGain);

  // Take top N recommendations based on transfers remaining
  for (let i = 0; i < Math.min(transfersRemaining, transferOpportunities.length); i++) {
    recommendations.push(transferOpportunities[i]);
  }

  return recommendations;
}

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

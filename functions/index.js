// Firebase Cloud Functions
// Basic example functions for your web app

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

// Initialize Firebase Admin
admin.initializeApp();

// CORS configuration for web requests
const cors = require('cors')({origin: true});

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
        message: 'Hello from Firebase!',
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

/**
 * Cloud Function: getData
 *
 * Example function that demonstrates POST request handling
 *
 * Request body:
 * {
 *   "name": "string (optional)"
 * }
 *
 * Response:
 * {
 *   "greeting": "Hello, [name]!",
 *   "data": { ... }
 * }
 */
exports.getData = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    // Only allow POST requests
    if (request.method !== 'POST') {
      return response.status(405).json({
        error: 'Method not allowed',
        message: 'This endpoint only accepts POST requests',
      });
    }

    try {
      const {name} = request.body;
      const userName = name || 'Guest';

      console.log('getData called for:', userName);

      // Example: Read from Firestore
      // const db = admin.firestore();
      // const doc = await db.collection('users').doc(userId).get();

      return response.status(200).json({
        greeting: `Hello, ${userName}!`,
        data: {
          receivedAt: new Date().toISOString(),
          message: 'This is example data from your Cloud Function',
        },
      });
    } catch (error) {
      console.error('Error in getData:', error);
      return response.status(500).json({
        error: 'Failed to get data',
        message: error.message,
      });
    }
  });
});

/**
 * Calculate expected points for a player based on FPL statistics
 * and custom weighting system
 *
 * @param {object} player - Player data from FPL API
 * @param {object} nextFixture - Next fixture data
 * @return {number} Expected points
 */
function calculateExpectedPoints(player, nextFixture) {
  const position = player.element_type;
  let expectedPoints = 0;

  // Base weighting system
  const WEIGHTS = {
    MIDFIELDER_GOAL: 5,
    FORWARD_GOAL: 4,
    DEFENDER_GOAL: 6,
    ASSIST: 3,
    CLEAN_SHEET: 4,
  };

  // Use FPL's expected goals (xG) and assists (xA) as probability proxies
  const expectedGoals = parseFloat(player.expected_goals_per_90 || 0);
  const expectedAssists = parseFloat(player.expected_assists_per_90 || 0);
  const cleanSheetProbability = parseFloat(
      player.clean_sheets_per_90 || 0,
  );

  // Calculate expected points based on position
  // Position: 1=GK, 2=DEF, 3=MID, 4=FWD
  if (position === 1) {
    // Goalkeeper
    expectedPoints += cleanSheetProbability * WEIGHTS.CLEAN_SHEET;
  } else if (position === 2) {
    // Defender
    expectedPoints += expectedGoals * WEIGHTS.DEFENDER_GOAL;
    expectedPoints += expectedAssists * WEIGHTS.ASSIST;
    expectedPoints += cleanSheetProbability * WEIGHTS.CLEAN_SHEET;
  } else if (position === 3) {
    // Midfielder
    expectedPoints += expectedGoals * WEIGHTS.MIDFIELDER_GOAL;
    expectedPoints += expectedAssists * WEIGHTS.ASSIST;
  } else if (position === 4) {
    // Forward
    expectedPoints += expectedGoals * WEIGHTS.FORWARD_GOAL;
    expectedPoints += expectedAssists * WEIGHTS.ASSIST;
  }

  // Factor in form and fixture difficulty
  const form = parseFloat(player.form || 0);
  const fixtureDifficulty = nextFixture ? (6 - nextFixture.difficulty) / 5 : 1;

  expectedPoints = expectedPoints * (1 + form / 10) * fixtureDifficulty;

  return expectedPoints;
}

/**
 * Optimize FPL transfers based on current team and constraints
 *
 * @param {number} teamId - User's FPL team ID
 * @param {number} transfersRemaining - Number of free transfers
 * @param {number} bank - Remaining budget in millions
 * @return {object} Transfer recommendations
 */
async function optimizeTransfers(teamId, transfersRemaining, bank) {
  try {
    // Fetch all FPL data
    const bootstrapResponse = await axios.get(
        'https://fantasy.premierleague.com/api/bootstrap-static/',
    );
    const allPlayers = bootstrapResponse.data.elements;
    const teams = bootstrapResponse.data.teams;

    // Fetch user's team data
    const teamResponse = await axios.get(
        `https://fantasy.premierleague.com/api/entry/${teamId}/`,
    );
    const currentEvent = teamResponse.data.current_event;

    // Fetch fixtures for next gameweek
    const fixturesResponse = await axios.get(
        'https://fantasy.premierleague.com/api/fixtures/',
    );
    const nextFixtures = fixturesResponse.data.filter(
        (f) => f.event === currentEvent + 1,
    );

    // Fetch user's picks for current gameweek
    const picksResponse = await axios.get(
        `https://fantasy.premierleague.com/api/entry/${teamId}/event/${currentEvent}/picks/`,
    );
    const currentPicks = picksResponse.data.picks;

    // Map picks to full player data
    const currentTeam = currentPicks.map((pick) => {
      const player = allPlayers.find((p) => p.id === pick.element);
      return {
        ...player,
        pickId: pick.element,
        position: pick.position,
      };
    });

    // Calculate expected points for all players
    const playersWithScores = allPlayers.map((player) => {
      // Find next fixture for this player's team
      const nextFixture = nextFixtures.find(
          (f) => f.team_h === player.team || f.team_a === player.team,
      );

      const fixtureInfo = nextFixture ? {
        difficulty: nextFixture.team_h === player.team ?
          nextFixture.team_h_difficulty :
          nextFixture.team_a_difficulty,
      } : null;

      return {
        ...player,
        expectedPoints: calculateExpectedPoints(player, fixtureInfo),
        priceValue: player.now_cost / 10, // Convert to millions
      };
    });

    // Sort by expected points per price value
    playersWithScores.sort((a, b) => {
      const aValue = a.expectedPoints / a.priceValue;
      const bValue = b.expectedPoints / b.priceValue;
      return bValue - aValue;
    });

    // Find weakest players in current team
    const currentTeamWithScores = currentTeam.map((player) => {
      const nextFixture = nextFixtures.find(
          (f) => f.team_h === player.team || f.team_a === player.team,
      );

      const fixtureInfo = nextFixture ? {
        difficulty: nextFixture.team_h === player.team ?
          nextFixture.team_h_difficulty :
          nextFixture.team_a_difficulty,
      } : null;

      return {
        ...player,
        expectedPoints: calculateExpectedPoints(player, fixtureInfo),
        priceValue: player.now_cost / 10,
      };
    });

    currentTeamWithScores.sort((a, b) => a.expectedPoints - b.expectedPoints);

    // Generate transfer recommendations
    const recommendations = [];
    let remainingBudget = bank;

    for (let i = 0; i < Math.min(transfersRemaining, 3); i++) {
      const playerOut = currentTeamWithScores[i];
      const sellingPrice = playerOut.priceValue;
      const availableBudget = remainingBudget + sellingPrice;

      // Find best replacement in same position
      const replacement = playersWithScores.find((p) => {
        return (
          p.element_type === playerOut.element_type &&
          p.priceValue <= availableBudget &&
          p.expectedPoints > playerOut.expectedPoints &&
          !currentTeam.some((ct) => ct.id === p.id) &&
          !recommendations.some((r) => r.transferIn.id === p.id)
        );
      });

      if (replacement) {
        recommendations.push({
          transferOut: {
            id: playerOut.id,
            name: playerOut.web_name,
            team: teams.find((t) => t.id === playerOut.team)?.name,
            position: ['', 'GKP', 'DEF', 'MID', 'FWD'][playerOut.element_type],
            price: playerOut.priceValue,
            expectedPoints: playerOut.expectedPoints.toFixed(2),
          },
          transferIn: {
            id: replacement.id,
            name: replacement.web_name,
            team: teams.find((t) => t.id === replacement.team)?.name,
            position: ['', 'GKP', 'DEF', 'MID', 'FWD'][
                replacement.element_type
            ],
            price: replacement.priceValue,
            expectedPoints: replacement.expectedPoints.toFixed(2),
          },
          improvement: (
            replacement.expectedPoints - playerOut.expectedPoints
          ).toFixed(2),
        });

        remainingBudget = availableBudget - replacement.priceValue;
      }
    }

    return {
      recommendations,
      remainingBudget: remainingBudget.toFixed(1),
      totalImprovement: recommendations.reduce(
          (sum, r) => sum + parseFloat(r.improvement),
          0,
      ).toFixed(2),
    };
  } catch (error) {
    console.error('Error in optimizeTransfers:', error);
    throw error;
  }
}

/**
 * Cloud Function: optimizeFPLTransfers
 *
 * Analyzes FPL team and recommends optimal transfers
 *
 * Request body:
 * {
 *   "teamId": number,
 *   "transfersRemaining": number,
 *   "bank": number
 * }
 *
 * Response:
 * {
 *   "recommendations": [...],
 *   "remainingBudget": number,
 *   "totalImprovement": number
 * }
 */
exports.optimizeFPLTransfers = functions.https.onRequest(
    (request, response) => {
      return cors(request, response, async () => {
        // Only allow POST requests
        if (request.method !== 'POST') {
          return response.status(405).json({
            error: 'Method not allowed',
            message: 'This endpoint only accepts POST requests',
          });
        }

        try {
          const {teamId, transfersRemaining, bank} = request.body;

          // Validate inputs
          if (!teamId || typeof teamId !== 'number') {
            return response.status(400).json({
              error: 'Invalid input',
              message: 'teamId must be a number',
            });
          }

          if (
            transfersRemaining === undefined ||
          typeof transfersRemaining !== 'number'
          ) {
            return response.status(400).json({
              error: 'Invalid input',
              message: 'transfersRemaining must be a number',
            });
          }

          if (bank === undefined || typeof bank !== 'number') {
            return response.status(400).json({
              error: 'Invalid input',
              message: 'bank must be a number',
            });
          }

          console.log('optimizeFPLTransfers called for team:', teamId);

          const result = await optimizeTransfers(
              teamId,
              transfersRemaining,
              bank,
          );

          return response.status(200).json(result);
        } catch (error) {
          console.error('Error in optimizeFPLTransfers:', error);
          return response.status(500).json({
            error: 'Failed to optimize transfers',
            message: error.message,
          });
        }
      });
    },
);

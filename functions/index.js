// Firebase Cloud Functions
// Basic example functions for your web app

const functions = require('firebase-functions');
const admin = require('firebase-admin');

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

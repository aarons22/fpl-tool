# Cloud Functions API Reference

This document provides documentation for all Cloud Functions in the FPL Transfer Optimizer application.

## Base URLs

- **Production**: `https://us-central1-fpl-tool-dfb38.cloudfunctions.net`
- **Local Emulator**: `http://localhost:5001/fpl-tool-dfb38/us-central1`

---

## Functions

### optimizeFPLTransfers

Analyzes a Fantasy Premier League team and provides optimized transfer recommendations based on expected points, fixture difficulty, and budget constraints.

**Endpoint**: `POST /optimizeFPLTransfers`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "teamId": number,           // FPL team ID (required)
  "transfersRemaining": number, // Number of free transfers available (required)
  "bank": number              // Remaining budget in millions (required)
}
```

**Example Request**:
```bash
curl -X POST http://localhost:5001/fpl-tool-dfb38/us-central1/optimizeFPLTransfers \
  -H "Content-Type: application/json" \
  -d '{
    "teamId": 123456,
    "transfersRemaining": 1,
    "bank": 0.5
  }'
```

**Success Response** (200 OK):
```json
{
  "recommendations": [
    {
      "transferOut": {
        "id": 123,
        "name": "Player Name",
        "team": "Team Name",
        "position": "MID",
        "price": 7.5,
        "expectedPoints": "4.20"
      },
      "transferIn": {
        "id": 456,
        "name": "New Player",
        "team": "Team Name",
        "position": "MID",
        "price": 7.0,
        "expectedPoints": "6.50"
      },
      "improvement": "2.30"
    }
  ],
  "remainingBudget": "1.0",
  "totalImprovement": "2.30"
}
```

**Error Responses**:

- **400 Bad Request** - Invalid input parameters
  ```json
  {
    "error": "Invalid input",
    "message": "teamId must be a number"
  }
  ```

- **405 Method Not Allowed** - Non-POST request
  ```json
  {
    "error": "Method not allowed",
    "message": "This endpoint only accepts POST requests"
  }
  ```

- **500 Internal Server Error** - Server error or FPL API issues
  ```json
  {
    "error": "Failed to optimize transfers",
    "message": "Error details..."
  }
  ```

**Algorithm Details**:

The function uses the following weighting system for calculating expected points:

- **Midfielder Goal**: 5 points
- **Forward Goal**: 4 points
- **Defender Goal**: 6 points
- **Assist**: 3 points
- **Clean Sheet** (Defender/Goalkeeper): 4 points

Expected points are calculated using:
- FPL's expected goals per 90 minutes (xG)
- FPL's expected assists per 90 minutes (xA)
- Clean sheet probability per 90 minutes
- Player form multiplier
- Fixture difficulty rating

The optimizer:
1. Fetches all player data from FPL API
2. Calculates expected points for all players
3. Identifies weakest players in current team
4. Finds best value replacements within budget
5. Returns up to the number of free transfers available (max 3)

**Data Sources**:
- Fantasy Premier League API: `https://fantasy.premierleague.com/api/`

**Notes**:
- Team ID can be found in your FPL profile URL
- The function respects position constraints (replacements must match position)
- Budget calculations include selling price of transferred-out players
- Recommendations are sorted by expected point improvement

---

### helloWorld

Simple test function that returns a greeting message.

**Endpoint**: `GET /helloWorld`

**Request**: No parameters required

**Response** (200 OK):
```json
{
  "message": "Hello from Firebase!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### getData

Example function demonstrating POST request handling with Firestore integration.

**Endpoint**: `POST /getData`

**Request Body**:
```json
{
  "name": "string (optional)"
}
```

**Response** (200 OK):
```json
{
  "greeting": "Hello, [name]!",
  "data": {
    "receivedAt": "2024-01-01T00:00:00.000Z",
    "message": "This is example data from your Cloud Function"
  }
}
```

---

## Testing

### Local Testing with Emulators

1. Start the Firebase emulators:
   ```bash
   firebase emulators:start
   ```

2. Test the optimizeFPLTransfers function:
   ```bash
   curl -X POST http://localhost:5001/fpl-tool-dfb38/us-central1/optimizeFPLTransfers \
     -H "Content-Type: application/json" \
     -d '{
       "teamId": 123456,
       "transfersRemaining": 1,
       "bank": 0.5
     }'
   ```

### Production Testing

```bash
curl -X POST https://us-central1-fpl-tool-dfb38.cloudfunctions.net/optimizeFPLTransfers \
  -H "Content-Type: application/json" \
  -d '{
    "teamId": 123456,
    "transfersRemaining": 1,
    "bank": 0.5
  }'
```

---

## Error Handling

All functions implement comprehensive error handling:

- **Input Validation**: All required parameters are validated before processing
- **CORS Support**: All functions support cross-origin requests
- **Logging**: All operations are logged for debugging
- **Graceful Failures**: Functions return meaningful error messages

---

## Rate Limiting

The FPL API does not have official rate limits, but it's recommended to:
- Cache responses when possible
- Avoid excessive requests in short periods
- Implement exponential backoff for retries

---

## Future Enhancements

Potential improvements to the optimization algorithm:

1. **Multi-week planning**: Optimize transfers across multiple gameweeks
2. **Chip strategy**: Factor in wildcard, bench boost, etc.
3. **Captain selection**: Recommend best captain choice
4. **Differential picks**: Find low-owned high-value players
5. **Injury/suspension data**: Filter out unavailable players
6. **Historical performance**: Weight recent performance more heavily

---

## Dependencies

- `firebase-functions`: ^4.5.0
- `firebase-admin`: ^12.0.0
- `axios`: Latest version (for HTTP requests to FPL API)
- `cors`: ^2.8.5

---

## Support

For issues or questions:
- Check the [README.md](README.md) for setup instructions
- Review the [DEVELOPMENT.md](DEVELOPMENT.md) for development workflow
- Open an issue on GitHub for bugs or feature requests

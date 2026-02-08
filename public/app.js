// Firebase Web App - Main Application Logic
// FPL Tool - Fantasy Premier League Analytics

// Determine Cloud Function URL based on environment
function getCloudFunctionUrl(functionName = 'helloWorld') {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Production (Firebase Hosting) - exact domain matches only
  if (hostname === 'fpl-tool-dfb38.web.app' || hostname === 'fpl-tool-dfb38.firebaseapp.com') {
    return `https://us-central1-fpl-tool-dfb38.cloudfunctions.net/${functionName}`;
  }

  // Local development (direct emulators)
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `http://${hostname}:5001/fpl-tool-dfb38/us-central1/${functionName}`;
  }

  // GitHub Codespaces / port-forwarded environment
  const codespaceMatch = hostname.match(/^(.+)-(\d+)(\.app\.github\.dev)$/);
  if (codespaceMatch) {
    const [, prefix, port, suffix] = codespaceMatch;
    if (port === "5000") {
      const functionsHost = `${prefix}-5001${suffix}`;
      return `${protocol}//${functionsHost}/fpl-tool-dfb38/us-central1/${functionName}`;
    }
  }

  // Generic port-forwarded environment fallback
  if (hostname.includes("5000")) {
    const functionsHost = hostname.replace("5000", "5001");
    return `${protocol}//${functionsHost}/fpl-tool-dfb38/us-central1/${functionName}`;
  }

  // Fallback: production URL
  console.warn("Unknown environment, using production URL");
  return `https://us-central1-fpl-tool-dfb38.cloudfunctions.net/${functionName}`;
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("FPL Tool initialized");
  console.log("Cloud Function URL:", getCloudFunctionUrl());

  // Get DOM elements
  const testFPLBtn = document.getElementById("testFPLBtn");
  const testOddsBtn = document.getElementById("testOddsBtn");
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const success = document.getElementById("success");
  const transferForm = document.getElementById("transferForm");

  // Button click handlers
  if (testFPLBtn) {
    testFPLBtn.addEventListener("click", async () => {
      await testFPLAPI();
    });
  }

  if (testOddsBtn) {
    testOddsBtn.addEventListener("click", async () => {
      await testOddsAPI();
    });
  }

  // Transfer form submit handler
  if (transferForm) {
    transferForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await getTransferRecommendations();
    });
  }
});

// Test FPL API
async function testFPLAPI() {
  // Show loading state
  showLoading(true, "Fetching FPL data...");
  hideError();
  hideSuccess();

  try {
    console.log("Testing FPL API...");

    const cloudFunctionUrl = getCloudFunctionUrl("getFPLBootstrap");

    const response = await fetch(cloudFunctionUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to call FPL function");
    }

    const data = await response.json();
    console.log("FPL API response:", data);

    if (data.success && data.data) {
      const playerCount = data.data.elements ? data.data.elements.length : 0;
      const teamCount = data.data.teams ? data.data.teams.length : 0;
      showSuccess(
        `FPL API working! Found ${playerCount} players across ${teamCount} teams.`
      );
    } else {
      showSuccess("FPL API executed successfully!");
    }
  } catch (err) {
    console.error("Error calling FPL API:", err);
    showError(
      err.message || "Failed to call FPL API. Please try again."
    );
  } finally {
    showLoading(false);
  }
}

// Test Odds API (now tests player props)
async function testOddsAPI() {
  // Show loading state
  showLoading(true, "Fetching player odds data...");
  hideError();
  hideSuccess();

  try {
    console.log("Testing Player Props Odds API...");

    const cloudFunctionUrl = getCloudFunctionUrl("getPlayerPropsOdds");

    const response = await fetch(cloudFunctionUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to call Player Props API function");
    }

    const data = await response.json();
    console.log("Player Props API response:", data);

    if (data.success && data.odds) {
      const eventCount = data.odds.length;
      showSuccess(
        `Player Props API working! Found odds for ${eventCount} events with markets: ${data.markets || 'goals, assists'}.`
      );
    } else if (data.success === false && data.error === 'API key not configured') {
      showError(
        "Odds API key not configured. Please set ODDS_API_KEY environment variable."
      );
    } else {
      showSuccess("Player Props API executed successfully!");
    }
  } catch (err) {
    console.error("Error calling Player Props API:", err);
    showError(
      err.message || "Failed to call Player Props API. Please try again."
    );
  } finally {
    showLoading(false);
  }
}

// UI Helper Functions
function showLoading(show, message = "Loading...") {
  const loading = document.getElementById("loading");
  const loadingText = loading.querySelector("p");

  if (show) {
    if (loadingText) {
      loadingText.textContent = message;
    }
    loading.classList.remove("hidden");
  } else {
    loading.classList.add("hidden");
  }
}

function showError(message) {
  const error = document.getElementById("error");
  error.querySelector("p").textContent = message;
  error.classList.remove("hidden");
}

function hideError() {
  const error = document.getElementById("error");
  error.classList.add("hidden");
}

function showSuccess(message) {
  const success = document.getElementById("success");
  success.querySelector("p").textContent = message;
  success.classList.remove("hidden");

  // Auto-hide after 5 seconds
  setTimeout(() => {
    success.classList.add("hidden");
  }, 5000);
}

function hideSuccess() {
  const success = document.getElementById("success");
  success.classList.add("hidden");
}

// Get Transfer Recommendations
async function getTransferRecommendations() {
  // Show loading state
  showLoading(true, "Analyzing your team and generating recommendations...");
  hideError();
  hideSuccess();

  // Hide previous recommendations
  const recommendationsDiv = document.getElementById("recommendations");
  recommendationsDiv.classList.add("hidden");

  try {
    console.log("Getting transfer recommendations...");

    // Get form values
    const teamId = document.getElementById("teamId").value;
    const transfersRemaining = parseInt(document.getElementById("transfersRemaining").value);
    const bankBalance = parseFloat(document.getElementById("bankBalance").value);
    const currentGameweek = document.getElementById("currentGameweek").value;

    // Build request body
    const requestBody = {
      teamId: teamId,
      transfersRemaining: transfersRemaining,
      bankBalance: bankBalance,
    };

    if (currentGameweek) {
      requestBody.currentGameweek = parseInt(currentGameweek);
    }

    const cloudFunctionUrl = getCloudFunctionUrl("getTransferRecommendations");

    const response = await fetch(cloudFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to get transfer recommendations");
    }

    const data = await response.json();
    console.log("Transfer recommendations response:", data);

    if (data.success && data.recommendations) {
      displayRecommendations(data.recommendations, data.metadata);
      showSuccess(`Found ${data.recommendations.length} transfer recommendation(s)!`);
    } else {
      showError(data.message || "Failed to generate recommendations");
    }
  } catch (err) {
    console.error("Error getting transfer recommendations:", err);
    showError(
      err.message || "Failed to get transfer recommendations. Please try again."
    );
  } finally {
    showLoading(false);
  }
}

// Display transfer recommendations
function displayRecommendations(recommendations, metadata) {
  const recommendationsDiv = document.getElementById("recommendations");
  const recommendationsList = document.getElementById("recommendationsList");

  // Clear previous results
  recommendationsList.innerHTML = "";

  if (!recommendations || recommendations.length === 0) {
    recommendationsList.innerHTML = `
      <div class="no-recommendations">
        <p>No beneficial transfers found at this time.</p>
        <p>Your current team looks good! Consider holding your transfers.</p>
      </div>
    `;
    recommendationsDiv.classList.remove("hidden");
    return;
  }

  // Add metadata info
  let metadataHTML = `
    <div class="recommendation-metadata">
      <p><strong>Team ID:</strong> ${metadata.teamId}</p>
      <p><strong>Gameweek:</strong> ${metadata.gameweek}</p>
      <p><strong>Free Transfers:</strong> ${metadata.transfersRemaining}</p>
      <p><strong>Bank Balance:</strong> £${metadata.bankBalance}m</p>
      <p><strong>Odds Data:</strong> ${metadata.oddsAvailable ? '✓ Available' : '✗ Not Available'}</p>
    </div>
  `;

  // Display each recommendation
  recommendations.forEach((rec, index) => {
    const transferHTML = `
      <div class="transfer-card">
        <div class="transfer-header">
          <h4>Transfer ${index + 1}</h4>
          <span class="points-gain">+${rec.pointsGain.toFixed(2)} pts</span>
        </div>
        <div class="transfer-details">
          <div class="player-out">
            <div class="transfer-label">OUT</div>
            <div class="player-info">
              <div class="player-name">${rec.playerOut.name}</div>
              <div class="player-stats">
                <span>£${rec.playerOut.cost.toFixed(1)}m</span>
                <span>${rec.playerOut.expectedPoints.toFixed(1)} pts</span>
                <span>${rec.playerOut.form} form</span>
              </div>
            </div>
          </div>
          <div class="transfer-arrow">→</div>
          <div class="player-in">
            <div class="transfer-label">IN</div>
            <div class="player-info">
              <div class="player-name">${rec.playerIn.name}</div>
              <div class="player-stats">
                <span>£${rec.playerIn.cost.toFixed(1)}m</span>
                <span>${rec.playerIn.expectedPoints.toFixed(1)} pts</span>
                <span>${rec.playerIn.form} form</span>
              </div>
            </div>
          </div>
        </div>
        <div class="transfer-summary">
          <p><strong>Cost Change:</strong> ${rec.costChange >= 0 ? '+' : ''}£${rec.costChange.toFixed(1)}m</p>
          <p><strong>Value Score:</strong> ${rec.playerIn.valueScore.toFixed(2)} pts/£m</p>
          <p><strong>Ownership:</strong> ${rec.playerIn.selectedByPercent}%</p>
        </div>
      </div>
    `;
    metadataHTML += transferHTML;
  });

  recommendationsList.innerHTML = metadataHTML;
  recommendationsDiv.classList.remove("hidden");
}

// Firebase Web App - Main Application Logic

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
  console.log("FPL Transfer Optimizer initialized");
  console.log("Cloud Function URL:", getCloudFunctionUrl("optimizeFPLTransfers"));

  // Get DOM elements
  const fplForm = document.getElementById("fplForm");
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const results = document.getElementById("results");

  // Form submit handler
  fplForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await optimizeTransfers();
  });
});

// Optimize FPL Transfers
async function optimizeTransfers() {
  // Show loading state
  showLoading(true, "Analyzing your team...");
  hideError();
  hideResults();

  try {
    // Get form values
    const teamId = parseInt(document.getElementById("teamId").value);
    const transfersRemaining = parseInt(
      document.getElementById("transfersRemaining").value
    );
    const bank = parseFloat(document.getElementById("bank").value);

    console.log("Optimizing transfers for:", {
      teamId,
      transfersRemaining,
      bank,
    });

    const cloudFunctionUrl = getCloudFunctionUrl("optimizeFPLTransfers");

    const response = await fetch(cloudFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId,
        transfersRemaining,
        bank,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to optimize transfers");
    }

    const data = await response.json();
    console.log("Optimization result:", data);

    // Display results
    displayResults(data);
  } catch (err) {
    console.error("Error optimizing transfers:", err);
    showError(
      err.message || "Failed to optimize transfers. Please check your Team ID and try again."
    );
  } finally {
    showLoading(false);
  }
}

// Display transfer recommendations
function displayResults(data) {
  const recommendationsDiv = document.getElementById("recommendations");
  const summaryDiv = document.getElementById("summary");

  // Clear previous results
  recommendationsDiv.innerHTML = "";
  summaryDiv.innerHTML = "";

  if (data.recommendations.length === 0) {
    recommendationsDiv.innerHTML = `
      <div class="info-message">
        <p>No beneficial transfers found with your current budget and constraints. Your team looks good!</p>
      </div>
    `;
  } else {
    // Create transfer cards
    data.recommendations.forEach((rec, index) => {
      const transferCard = document.createElement("div");
      transferCard.className = "transfer-card";
      transferCard.innerHTML = `
        <div class="transfer-number">Transfer ${index + 1}</div>
        <div class="transfer-content">
          <div class="player-out">
            <div class="player-label">OUT</div>
            <div class="player-name">${rec.transferOut.name}</div>
            <div class="player-details">
              ${rec.transferOut.team} | ${rec.transferOut.position}
            </div>
            <div class="player-stats">
              £${rec.transferOut.price}m | ${rec.transferOut.expectedPoints} pts
            </div>
          </div>
          <div class="transfer-arrow">→</div>
          <div class="player-in">
            <div class="player-label">IN</div>
            <div class="player-name">${rec.transferIn.name}</div>
            <div class="player-details">
              ${rec.transferIn.team} | ${rec.transferIn.position}
            </div>
            <div class="player-stats">
              £${rec.transferIn.price}m | ${rec.transferIn.expectedPoints} pts
            </div>
          </div>
        </div>
        <div class="improvement">+${rec.improvement} expected pts</div>
      `;
      recommendationsDiv.appendChild(transferCard);
    });

    // Add summary
    summaryDiv.innerHTML = `
      <div class="summary-stats">
        <div class="stat">
          <span class="stat-label">Total Improvement:</span>
          <span class="stat-value">+${data.totalImprovement} pts</span>
        </div>
        <div class="stat">
          <span class="stat-label">Remaining Budget:</span>
          <span class="stat-value">£${data.remainingBudget}m</span>
        </div>
      </div>
    `;
  }

  showResults();
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

  // Auto-hide after 3 seconds
  setTimeout(() => {
    success.classList.add("hidden");
  }, 3000);
}

function hideSuccess() {
  const success = document.getElementById("success");
  if (success) {
    success.classList.add("hidden");
  }
}

function showResults() {
  const results = document.getElementById("results");
  results.classList.remove("hidden");
}

function hideResults() {
  const results = document.getElementById("results");
  results.classList.add("hidden");
}

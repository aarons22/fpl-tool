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
  console.log("Firebase Web App initialized");
  console.log("Cloud Function URL:", getCloudFunctionUrl());

  // Get DOM elements
  const testBtn = document.getElementById("testBtn");
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const success = document.getElementById("success");

  // Button click handler
  testBtn.addEventListener("click", async () => {
    await testCloudFunction();
  });
});

// Test Cloud Function
async function testCloudFunction() {
  // Show loading state
  showLoading(true);
  hideError();
  hideSuccess();

  try {
    console.log("Testing Cloud Function...");

    const cloudFunctionUrl = getCloudFunctionUrl();

    const response = await fetch(cloudFunctionUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to call Cloud Function");
    }

    const data = await response.json();
    console.log("Cloud Function response:", data);

    // Display success
    showSuccess(data.message || "Cloud Function executed successfully!");
  } catch (err) {
    console.error("Error calling Cloud Function:", err);
    showError(
      err.message || "Failed to call Cloud Function. Please try again."
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

  // Auto-hide after 3 seconds
  setTimeout(() => {
    success.classList.add("hidden");
  }, 3000);
}

function hideSuccess() {
  const success = document.getElementById("success");
  success.classList.add("hidden");
}

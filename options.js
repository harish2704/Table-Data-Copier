// Options script for Table Data Copier extension

// Load settings when the page loads
document.addEventListener('DOMContentLoaded', function() {
  loadSettings();
  setupEventListeners();
});

// Load settings from Chrome storage
function loadSettings() {
  chrome.storage.sync.get(['useCSV'], function(result) {
    const useCSV = result.useCSV || false;
    document.getElementById('csvToggle').checked = useCSV;
  });
}

// Set up event listeners
function setupEventListeners() {
  const csvToggle = document.getElementById('csvToggle');
  
  // Listen for changes to the CSV toggle
  csvToggle.addEventListener('change', function() {
    const useCSV = this.checked;
    saveSetting('useCSV', useCSV);
  });
}

// Save a setting to Chrome storage
function saveSetting(key, value) {
  const setting = {};
  setting[key] = value;
  
  chrome.storage.sync.set(setting, function() {
    showSaveStatus('Settings saved successfully!');
  });
}

// Show save status message
function showSaveStatus(message) {
  const status = document.getElementById('saveStatus');
  status.textContent = message;
  
  // Clear the message after 2 seconds
  setTimeout(function() {
    status.textContent = '';
  }, 2000);
}
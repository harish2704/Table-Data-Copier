// Options script for Table Data Copier extension

// Load settings when the page loads
document.addEventListener('DOMContentLoaded', function() {
  loadSettings();
  setupEventListeners();
  loadShortcutInfo();
});

// Load settings from Chrome storage
function loadSettings() {
  chrome.storage.sync.get(['useCSV', 'quoteStrings', 'quoteType'], function(result) {
    const useCSV = result.useCSV || true;
    const quoteStrings = result.quoteStrings || true;
    const quoteType = result.quoteType || 'double';
    
    document.getElementById('csvToggle').checked = useCSV;
    document.getElementById('quoteStringsToggle').checked = quoteStrings;
    
    // Set the appropriate radio button as checked
    if (quoteType === 'single') {
      document.getElementById('singleQuote').checked = true;
    } else {
      document.getElementById('doubleQuote').checked = true;
    }
    
    // Disable quote type options if quoting is disabled
    updateQuoteTypeOptionsVisibility(quoteStrings);
  });
}

// Set up event listeners
function setupEventListeners() {
  const csvToggle = document.getElementById('csvToggle');
  const quoteStringsToggle = document.getElementById('quoteStringsToggle');
  const doubleQuoteRadio = document.getElementById('doubleQuote');
  const singleQuoteRadio = document.getElementById('singleQuote');
  
  // Listen for changes to the CSV toggle
  csvToggle.addEventListener('change', function() {
    const useCSV = this.checked;
    saveSetting('useCSV', useCSV);
  });
  
  // Listen for changes to the quote strings toggle
  quoteStringsToggle.addEventListener('change', function() {
    const quoteStrings = this.checked;
    saveSetting('quoteStrings', quoteStrings);
    updateQuoteTypeOptionsVisibility(quoteStrings);
  });
  
  // Listen for changes to the quote type radio buttons
  doubleQuoteRadio.addEventListener('change', function() {
    if (this.checked) {
      saveSetting('quoteType', 'double');
    }
  });
  
  singleQuoteRadio.addEventListener('change', function() {
    if (this.checked) {
      saveSetting('quoteType', 'single');
    }
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

// Update visibility of quote type options based on quote strings setting
function updateQuoteTypeOptionsVisibility(quoteStringsEnabled) {
  const quoteTypeOptions = document.querySelector('.quote-type-options');
  if (quoteTypeOptions) {
    quoteTypeOptions.style.opacity = quoteStringsEnabled ? '1' : '0.5';
    quoteTypeOptions.style.pointerEvents = quoteStringsEnabled ? 'auto' : 'none';
  }
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

// Load and display keyboard shortcut information
function loadShortcutInfo() {
  // Get the current shortcuts from Chrome commands API
  chrome.commands.getAll((commands) => {
    const copyCommand = commands.find(cmd => cmd.name === 'copy-table-data');
    const flippedCommand = commands.find(cmd => cmd.name === 'copy-table-data-flipped');
    
    if (copyCommand) {
      const shortcutElement = document.getElementById('currentShortcut');
      shortcutElement.textContent = copyCommand.shortcut || 'Ctrl+Shift+C';
    }
    
    if (flippedCommand) {
      const flippedShortcutElement = document.getElementById('flippedShortcut');
      flippedShortcutElement.textContent = flippedCommand.shortcut || 'Ctrl+Shift+F';
    }
  });
}

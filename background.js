// Background script for Table Data Copier extension

// Create context menu when extension loads
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'copyTableData',
    title: 'Copy Table Data',
    contexts: ['all']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'copyTableData') {
    // Send message to content script to copy table data
    chrome.tabs.sendMessage(tab.id, { action: 'copyTableData' });
  }
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let key in changes) {
    let storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});
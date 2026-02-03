// Content script for Table Data Copier extension

let selectedCells = [];
let isTableSelectionMode = false;
let dragStartCell = null;
let isDragging = false;

// Initialize the extension
function init() {
  // Add event listeners for table interaction
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'copyTableData') {
      copySelectedData();
    }
  });
}

// Handle mouse down events
function handleMouseDown(event) {
  // Check if Ctrl key is pressed and it's a left click
  if (event.ctrlKey && event.button === 0) {
    const target = event.target;

    // Check if the target is a table cell
    if (target.tagName === 'TD' || target.tagName === 'TH') {
      event.preventDefault();
      event.stopPropagation();

      // Start drag selection or toggle individual cell
      if (!isDragging) {
        dragStartCell = target;
        isDragging = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        // Clear previous selection and select the start cell
        clearSelection();
        selectCells([target]);
        isTableSelectionMode = true;
      }
    }
  } else {
    // If not Ctrl+click, clear selection if in selection mode
    if (isTableSelectionMode) {
      clearSelection();
      isTableSelectionMode = false;
    }
  }
}

// Handle mouse move events for drag selection
function handleMouseMove(event) {
  if (isDragging && dragStartCell) {
    const target = event.target;
    
    // Check if the target is a table cell
    if (target.tagName === 'TD' || target.tagName === 'TH') {
      // Get all cells in the rectangle between start and current cell
      const cellsToSelect = getCellsInRectangle(dragStartCell, target);
      selectCells(cellsToSelect);
    }
  }
}

// Handle mouse up events to end drag selection
function handleMouseUp(event) {
  isDragging = false;
  dragStartCell = null;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}

// Handle key down events
function handleKeyDown(event) {
  // Check for Ctrl+C to copy selected data
  if (event.ctrlKey && event.key === 'c' && isTableSelectionMode) {
    event.preventDefault();
    copySelectedData();
  }
}

// Handle key up events
function handleKeyUp(event) {
  // If Ctrl key is released, exit selection mode
  if (!event.ctrlKey && isTableSelectionMode) {
    isTableSelectionMode = false;
  }
}

// Toggle cell selection (for individual cell selection)
function toggleCellSelection(cell) {
  const cellIndex = selectedCells.indexOf(cell);

  if (cellIndex === -1) {
    // Add cell to selection
    selectedCells.push(cell);
    cell.style.backgroundColor = '#ffff99'; // Highlight selected cell
  } else {
    // Remove cell from selection
    selectedCells.splice(cellIndex, 1);
    cell.style.backgroundColor = ''; // Remove highlight
  }
}

// Select multiple cells at once
function selectCells(cells) {
  // Clear previous selection
  clearSelection();
  
  // Select new cells
  cells.forEach(cell => {
    selectedCells.push(cell);
    cell.style.backgroundColor = '#ffff99'; // Highlight selected cell
  });
}

// Get all cells in a rectangular area between two cells
function getCellsInRectangle(startCell, endCell) {
  const startRow = startCell.parentElement.rowIndex;
  const startCol = Array.prototype.indexOf.call(startCell.parentElement.children, startCell);
  const endRow = endCell.parentElement.rowIndex;
  const endCol = Array.prototype.indexOf.call(endCell.parentElement.children, endCell);
  
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);
  
  const table = startCell.closest('table');
  const rows = table.rows;
  const cells = [];
  
  for (let r = minRow; r <= maxRow; r++) {
    const row = rows[r];
    for (let c = minCol; c <= maxCol; c++) {
      if (row.cells[c]) {
        cells.push(row.cells[c]);
      }
    }
  }
  
  return cells;
}

// Clear all selections
function clearSelection() {
  selectedCells.forEach(cell => {
    cell.style.backgroundColor = '';
  });
  selectedCells = [];
}

// Copy selected data to clipboard
function copySelectedData() {
  if (selectedCells.length === 0) return;
  
  // Get settings for CSV format
  chrome.storage.sync.get(['useCSV'], (result) => {
    const useCSV = result.useCSV || false;
    const delimiter = useCSV ? ',' : '\t';
    
    // Extract data from selected cells
    const data = selectedCells.map(cell => {
      return cell.textContent.trim().replace(/\s+/g, ' ');
    });
    
    // Join data with appropriate delimiter
    const output = data.join(delimiter);
    
    // Copy to clipboard
    navigator.clipboard.writeText(output).then(() => {
      // Clear selection after copy
      clearSelection();
      isTableSelectionMode = false;
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
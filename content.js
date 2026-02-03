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
    } else if (request.action === 'copyTableDataFlipped') {
      copySelectedDataFlipped();
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
  
  // Get settings for CSV format and quote strings
  chrome.storage.sync.get(['useCSV', 'quoteStrings'], (result) => {
    const useCSV = result.useCSV || false;
    const quoteStrings = result.quoteStrings || false;
    const delimiter = useCSV ? ',' : '\t';
    
    // Group cells by row and sort by column index
    const rows = {};
    
    selectedCells.forEach(cell => {
      const row = cell.parentElement;
      const rowIndex = row.rowIndex;
      const colIndex = Array.prototype.indexOf.call(row.children, cell);
      
      if (!rows[rowIndex]) {
        rows[rowIndex] = [];
      }
      
      rows[rowIndex].push({
        cell: cell,
        colIndex: colIndex,
        text: cell.textContent.trim().replace(/\s+/g, ' ')
      });
    });
    
    // Sort rows by index and cells within each row by column index
    const sortedRows = Object.keys(rows)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(rowIndex => {
        return rows[rowIndex].sort((a, b) => a.colIndex - b.colIndex);
      });
    
    // Determine column types if quoting is enabled
    let columnTypes = {};
    if (quoteStrings && sortedRows.length > 0) {
      const maxCols = sortedRows[0].length;
      for (let col = 0; col < maxCols; col++) {
        if (sortedRows[0][col]) {
          columnTypes[col] = isStringValue(sortedRows[0][col].text);
        }
      }
    }
    
    // Build the output with proper row/column structure and quoting
    const output = sortedRows.map(rowCells => {
      return rowCells.map((cellData, colIndex) => {
        let cellText = cellData.text;
        if (quoteStrings && columnTypes[colIndex]) {
          cellText = `"${cellText}"`;
        }
        return cellText;
      }).join(delimiter);
    }).join('\n');
    
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

// Copy selected data to clipboard with rows and columns flipped
function copySelectedDataFlipped() {
  if (selectedCells.length === 0) return;
  
  // Get settings for CSV format and quote strings
  chrome.storage.sync.get(['useCSV', 'quoteStrings'], (result) => {
    const useCSV = result.useCSV || false;
    const quoteStrings = result.quoteStrings || false;
    const delimiter = useCSV ? ',' : '\t';
    
    // Group cells by row and sort by column index
    const rows = {};
    
    selectedCells.forEach(cell => {
      const row = cell.parentElement;
      const rowIndex = row.rowIndex;
      const colIndex = Array.prototype.indexOf.call(row.children, cell);
      
      if (!rows[rowIndex]) {
        rows[rowIndex] = [];
      }
      
      rows[rowIndex].push({
        cell: cell,
        colIndex: colIndex,
        text: cell.textContent.trim().replace(/\s+/g, ' ')
      });
    });
    
    // Sort rows by index and cells within each row by column index
    const sortedRows = Object.keys(rows)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(rowIndex => {
        return rows[rowIndex].sort((a, b) => a.colIndex - b.colIndex);
      });
    
    // Find the maximum number of columns
    const maxCols = sortedRows.reduce((max, row) => Math.max(max, row.length), 0);
    
    // Transpose the data (flip rows and columns)
    const flippedData = [];
    for (let col = 0; col < maxCols; col++) {
      const flippedRow = [];
      for (let row = 0; row < sortedRows.length; row++) {
        if (sortedRows[row][col]) {
          flippedRow.push(sortedRows[row][col].text);
        } else {
          flippedRow.push(''); // Fill empty cells for irregular tables
        }
      }
      flippedData.push(flippedRow);
    }
    
    // Determine column types if quoting is enabled (first row of flipped data)
    let columnTypes = {};
    if (quoteStrings && flippedData.length > 0) {
      for (let col = 0; col < flippedData[0].length; col++) {
        columnTypes[col] = isStringValue(flippedData[0][col]);
      }
    }
    
    // Build the output with flipped row/column structure and quoting
    const output = flippedData.map(rowCells => {
      return rowCells.map((cellText, colIndex) => {
        if (quoteStrings && columnTypes[colIndex]) {
          return `"${cellText}"`;
        }
        return cellText;
      }).join(delimiter);
    }).join('\n');
    
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

// Helper function to determine if a value is a string (not numeric)
function isStringValue(value) {
  if (value === null || value === undefined || value === '') {
    return true; // Treat empty/null as string
  }
  
  // Check if it's a number (including scientific notation)
  const trimmed = value.trim();
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed)) {
    return false; // It's a number
  }
  
  // Check if it looks like a date (YYYY-MM-DD or MM/DD/YYYY format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed) || /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    return false; // It's a date
  }
  
  return true; // It's a string
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

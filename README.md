# Table Data Copier - Chrome Extension

A powerful Chrome extension that makes copying tabular data from web pages fast, flexible, and precise. Whether you need to copy a single cell, a rectangular selection, or transpose your data, this extension has you covered.

## 🚀 Features

### Core Functionality
- **Smart Cell Selection**: Hold `Ctrl` and drag to select rectangular areas of table cells
- **Individual Cell Selection**: Hold `Ctrl` and click to select/deselect individual cells
- **Visual Feedback**: Selected cells are highlighted with a yellow background
- **Row/Column Preservation**: Maintains table structure when copying (rows stay as rows, columns as columns)

### Copy Modes
- **Standard Copy**: Copy selected data preserving original table structure
- **Flipped Copy**: Transpose data (rows become columns, columns become rows) - perfect for data analysis

### Multiple Access Methods
- **Right-click Context Menu**: Both copy options available in context menu
- **Keyboard Shortcuts**:
  - `Ctrl+Shift+C` - Copy table data (standard)
  - `Ctrl+Shift+F` - Copy table data flipped
- **Configurable Shortcuts**: Customize keyboard shortcuts through Chrome extension settings

### Smart Data Formatting
- **CSV/TSV Toggle**: Choose between comma-separated or tab-separated values
- **Intelligent Quoting**: Automatically quote string columns while leaving numeric data unquoted
- **Column Type Detection**: Analyzes first value in each column to determine data type

## 📋 Data Type Recognition

The extension intelligently recognizes different data types:

| Data Type | Examples | Quoted? |
|-----------|----------|---------|
| **Numbers** | `123`, `45.67`, `-89`, `1.23e-4` | ❌ No |
| **Dates** | `2023-12-25`, `12/25/2023` | ❌ No |
| **Strings** | `Name`, `Product A`, `Hello World` | ✅ Yes |
| **Empty/Null** | (empty cells) | ✅ Yes |

## ⚙️ Settings

Access settings by clicking the extension icon or through Chrome's extension options.

### Format Settings
- **CSV vs TSV**: Toggle between comma-separated and tab-separated values
- **Always Quote String Columns**: Enable to automatically quote string-type columns

### Keyboard Shortcuts
- **Copy Table Data**: `Ctrl+Shift+C` (default)
- **Copy Table Data Flipped**: `Ctrl+Shift+F` (default)
- **Customization**: Change shortcuts through Chrome Extensions → Table Data Copier → Keyboard shortcuts

## 🎯 Usage Examples

### Example 1: Standard Copy
**Selected Table**:
```
Name    Age    City
John    25     New York
Jane    30     Los Angeles
```

**Output (TSV)**:
```
Name	Age	City
John	25	New York
Jane	30	Los Angeles
```

**Output (CSV)**:
```
Name,Age,City
John,25,New York
Jane,30,Los Angeles
```

### Example 2: Flipped Copy
**Selected Table**:
```
Product    Q1    Q2    Q3
Widget A   100   150   200
Widget B   75    125   175
```

**Standard Copy Output**:
```
Product	Q1	Q2	Q3
Widget A	100	150	200
Widget B	75	125	175
```

**Flipped Copy Output**:
```
Product	Widget A	Widget B
Q1	100	75
Q2	150	125
Q3	200	175
```

### Example 3: Smart Quoting
**Selected Table**:
```
Name    Age    Salary    Start Date
John    25     50000     2023-01-15
Jane    30     60000     2022-05-20
```

**With Quoting Enabled**:
```
"Name"	Age	Salary	"Start Date"
"John"	25	50000	"2023-01-15"
"Jane"	30	60000	"2022-05-20"
```

## 🛠️ Installation

### Method 1: Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store
2. Search for "Table Data Copier"
3. Click "Add to Chrome"
4. Confirm installation

### Method 2: Developer Mode (For Testing)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension directory
6. The extension icon will appear in your toolbar

## 📖 How It Works

1. **Selection**: Hold `Ctrl` and click/drag to select table cells
2. **Copy**: Use any of the following methods:
   - Right-click → "Copy Table Data" or "Copy Table Data Flipped"
   - Keyboard shortcuts: `Ctrl+Shift+C` or `Ctrl+Shift+F`
   - Selection mode: `Ctrl+C` while cells are selected
3. **Paste**: Paste into any application (spreadsheet, text editor, etc.)

## 🔧 Troubleshooting

### Extension Not Working?
- Ensure you're on a page with HTML tables
- Check that you're holding `Ctrl` while selecting cells
- Verify the extension is enabled in Chrome extensions

### Copy Not Working?
- Make sure cells are selected (they should have a yellow highlight)
- Try using the context menu instead of keyboard shortcuts
- Check Chrome's clipboard permissions

### Keyboard Shortcuts Not Working?
- Verify shortcuts are configured in Chrome Extensions → Keyboard shortcuts
- Check for conflicts with other extensions or browser shortcuts
- Try using the context menu as an alternative

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Chrome Extension APIs
- Uses modern JavaScript (ES6+)
- Cross-browser compatible design principles

## 📞 Support

If you have any questions, issues, or feature requests:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Open an issue on the [GitHub repository](https://github.com/yourusername/table-data-copier/issues)
3. Include details about your browser version, operating system, and the website you're trying to copy from

---

**Table Data Copier** - Making data extraction from web tables simple and efficient! 📊✨
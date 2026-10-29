# Color Picker Chrome Extension

A lightweight Chrome extension designed to help users pick colors from webpages and quickly copy color values for design and development workflows.

## Overview

The Color Picker extension simplifies identifying and reusing colors while browsing. It supports designers, developers, and anyone working with web interfaces.

## Features

- **EyeDropper API**: Pick any color directly from the page.
- **Manual input**: Enter a hex color value manually.
- **Color name lookup**: Automatically fetch the color name via TheColorAPI.
- **History**: Stores the last 10 selected colors using Chrome's local storage.
- **Copy to clipboard**: One‑click copy of the hex value.
- **Delete**: Remove unwanted colors from the history.
- **Responsive UI**: Popup built with HTML, CSS, and JavaScript.

## Technologies

- JavaScript (ES6)
- HTML5 & CSS3
- Chrome Extension Manifest V3
- Chrome Storage API
- EyeDropper API
- Fetch API for external color name service

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Turn on **Developer mode** (top‑right toggle).
4. Click **Load unpacked** and select the repository folder.
5. The extension icon will appear next to the address bar.

## Usage

1. Click the extension icon to open the popup.
2. Press **Pick** to activate the EyeDropper and select a color from any page.
3. Or type a hex code in the **Manual** field.
4. The selected color appears in the history list with its hex value and fetched name.
5. Use the **Copy** button to copy the hex to the clipboard.
6. Use the **Delete** (trash) button to remove a color from the history.

## Project Status

All source files are present and functional. No further implementation is required.

## License

MIT License
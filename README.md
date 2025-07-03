# MX UI Components Library

## Overview
MX UI Components is a lightweight, framework-agnostic UI component library built with vanilla HTML, CSS, and JavaScript..

## Features

- **Theming Support**: Built-in light and dark themes with CSS variables
- **No Dependencies**: Pure vanilla implementation, no frameworks required
- **Accessible**: Follows WAI-ARIA design patterns
- **Customizable**: Easy to customize with CSS variables
- **Responsive**: Works on all screen sizes

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mah-ui-components.git
   cd mx-ui-components
   ```

2. Include the necessary files in your HTML:
   ```html
   <link rel="stylesheet" href="mx/main.css">
   <script type="module" src="mx/main.js"></script>
   ```

## Available Components

### Basic Components
- [x] Button
- [x] Input
- [x] Textarea
- [x] Checkbox
- [x] Toggle
- [x] Toggle Group
- [x] Switch
- [x] Select

### Layout Components
- [x] Card
- [x] Accordion
- [x] Separator
- [x] Aspect Ratio
- [x] Avatar
- [x] Badge

### Navigation
- [x] Dropdown Menu
- [x] Breadcrumb
- [x] Pagination
- [x] Hover Card

### Overlays
- [x] Alert
- [x] Dialog
- [x] Drawer
- [x] Tooltip (via hover-card)

### Data Display
- [x] Carousel
- [x] Slider

## Theming

The library supports both light and dark themes out of the box. You can toggle between themes by adding/removing the `data-theme="dark"` attribute on the `body` element.

### Colors
All colors are defined as CSS variables in `global.css`. You can override these variables to customize the look and feel of the components.

## Development

1. Clone the repository.
2. Open `index.html` in your browser to see all components in action.
3. Make changes to the component files in the `mx/components/..` directory.
4. Test your changes and your are good to go.

## Project Structure

```
mx/
├── components/         # Individual component implementations
│   └── ...
├── global.css         # Global styles and variables
├── main.css           # Component imports
└── main.js            # JavaScript entry point
```
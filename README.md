# Interactive Abacus Calculator

A modern, web-based implementation of a traditional Chinese suanpan abacus with 13 rods, designed for both educational purposes and practical calculations.

## Features

- **Interactive Interface**
  - Click-and-drag bead manipulation
  - Touch support for mobile devices
  - Keyboard navigation
  - Responsive design for all screen sizes

- **Advanced Calculation**
  - Support for values up to 999,999,999,999.99
  - Real-time value display
  - Separate heaven and earth bead calculations
  - Rod-by-rod value tracking

- **User Experience**
  - Undo/redo functionality
  - Rod reset with Shift+Click
  - State preservation
  - Smooth animations

- **Accessibility**
  - Keyboard navigation support
  - ARIA labels for screen readers
  - High contrast visual feedback
  - Clear, readable typography

## Usage

### Basic Operations
1. **Moving Beads**
   - Click or drag beads to move them up/down
   - Use arrow keys for keyboard navigation
   - Touch and drag on mobile devices

2. **Rod Controls**
   - Shift+Click to reset individual rods
   - Each rod represents a place value (10^n)
   - Heaven beads (top) count as 5
   - Earth beads (bottom) count as 1

3. **History Controls**
   - Use Undo/Redo buttons to navigate calculation history
   - Reset button clears all beads
   - Current value updates in real-time

## Technical Details

### Architecture
- Pure JavaScript implementation
- CSS3 for styling and animations
- HTML5 semantic markup
- Local storage for state persistence

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance
- 60 FPS animations
- Responsive touch interactions
- Efficient state management
- Minimal memory footprint

## Development

### Setup
1. Clone the repository
2. Open index.html in a modern browser
3. No build process required

### Project Structure
```
├── index.html      # Main HTML structure
├── style.css       # Styling and animations
├── script.js       # Core functionality
└── README.md       # Documentation
```

## License

MIT License - Feel free to use and modify for your own projects.

## Acknowledgments

Inspired by traditional Chinese suanpan abacus design and modern web development practices.
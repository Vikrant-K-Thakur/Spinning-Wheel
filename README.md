# Alphabet Spinning Wheel

A beautiful and interactive spinning wheel game built with React that randomly selects letters from A to Z.

## Features

- **Circular Wheel Design**: 26 equal sections labeled A-Z with alternating colors
- **Smooth Animations**: CSS-powered spinning animation with easing
- **Random Selection**: Uses JavaScript Math.random() for fair letter selection
- **Sound Effects**: Audio feedback for spinning and stopping
- **Responsive Design**: Works on both desktop and mobile devices
- **Visual Feedback**: Pointer indicator and result display
- **Clean UI**: Modern gradient background with professional styling

## Project Structure

```
src/
├── components/
│   ├── SpinningWheel.jsx    # Main wheel component
│   ├── SpinningWheel.css    # Wheel styling and animations
│   ├── Header.jsx           # Header component
│   └── Header.css           # Header styling
├── App.js                   # Main app component
├── index.js                 # React entry point
└── index.css               # Global styles
```

## How to Use

1. Click the "SPIN" button in the center of the wheel
2. Watch the wheel spin with smooth animation
3. The wheel will stop on a random letter
4. The selected letter will be displayed below the wheel

## Technical Implementation

- **React Hooks**: Uses useState and useCallback for state management
- **CSS Animations**: Smooth transitions with cubic-bezier easing
- **Web Audio API**: Generates sound effects programmatically
- **Responsive Design**: Mobile-first approach with media queries
- **Modern CSS**: Flexbox layout, gradients, and shadows

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server

Enjoy spinning the wheel! 🎯
# Topo Map Generator

## Overview
The Topo Map Generator is a JavaScript application that allows users to generate and visualize terrain maps in both top-down and isometric views. The application utilizes object-oriented programming principles to manage the various components involved in terrain generation, rendering, and user interaction.

## Features
- **Terrain Generation**: Create various terrain patterns including random terrains, center peaks, wave patterns, crystal formations, and city grids.
- **Multiple Rendering Views**: Switch between top-down and isometric views for different visual perspectives of the terrain.
- **Interactive Effects**: Includes hover effects and scan line animations to enhance user experience.
- **Customizable Parameters**: Users can modify terrain properties such as maximum height and brush strength through a user interface.

## Project Structure
- **src/**: Contains the source code for the application.
  - **index.js**: Entry point for the application.
  - **app/**: Contains the main application logic.
  - **renderers/**: Classes responsible for rendering the terrain.
  - **models/**: Classes that manage terrain data and properties.
  - **generators/**: Classes that handle terrain generation algorithms.
  - **effects/**: Classes for visual effects applied to the canvas.
  - **controllers/**: Classes that manage user input and application state.
  - **utils/**: Utility functions for various operations.
  
- **public/**: Contains static files for the application.
  - **index.html**: HTML structure for the application.
  - **styles.css**: CSS styles for the application.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd topo-map-generator
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
To start the development server:
```
npm run dev
```

To build for production:
```
npm run build
```

To preview the production build:
```
npm run preview
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
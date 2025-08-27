# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Running the Application
```bash
npm start           # Runs the main application (index.js)
node index.js       # Alternative way to run the application
```

### Testing
Currently no testing framework is configured. The test script returns an error.
To set up testing, you'll need to choose and configure a test framework (e.g., Jest, Mocha).

## Architecture

### Project Overview
This is a Node.js project for LEMON-5 that implements a simple class-based feature management system.

### Core Component: GirlyGirl Class
Located in `index.js`, the main class provides:
- **Feature Management**: Methods to add and list features dynamically
- **Version Tracking**: Maintains version information (currently 1.0.0)
- **Console Output**: All operations log to console for visibility

### Module System
- Uses CommonJS (`module.exports`)
- The GirlyGirl class is exported for potential use as a module
- No external dependencies - pure Node.js implementation

### Application Flow
1. Creates a new GirlyGirl instance
2. Initializes the application (logs version)
3. Adds initial features ("Initial setup", "Basic structure")
4. Lists all current features

### Extension Points
When extending this codebase:
- New features can be added via `addFeature()` method
- The class structure allows easy addition of new methods
- No build step required - direct Node.js execution
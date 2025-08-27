# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Running the Application
```bash
npm start           # Runs the main application (index.js)
node index.js       # Alternative way to run the application
```

### Testing
```bash
npm test            # Runs Jest test suite
```
Jest is configured for unit testing. Test files should be named with `.test.js` suffix.

## Architecture

### Project Overview
This is a Node.js project for LEMON-5 that implements a simple class-based feature management system with secure secret management capabilities.

### Core Components

#### GirlyGirl Class
Located in `index.js`, the main class provides:
- **Feature Management**: Methods to add and list features dynamically
- **Version Tracking**: Maintains version information (currently 1.0.0)
- **Console Output**: All operations log to console for visibility

#### SecretService
Located in `src/services/SecretService.js`, provides secure secret management:
- **Scoped Storage**: Secrets are stored with scope isolation
- **CRUD Operations**: Full create, read, update, delete functionality
- **Error Handling**: Graceful error handling with success/error responses
- **Delegation Pattern**: Main service delegates to ScopedSecretService for operations

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
# GirlyGirl Client Application

## Cookie Banner Implementation

This React application includes a custom-built cookie consent banner that complies with privacy requirements.

### Features

- **Simple Accept/Reject UI**: Easy-to-use buttons for accepting or rejecting all cookies
- **First Visit Only Display**: Banner appears only on the user's first visit
- **localStorage Persistence**: Consent preferences are stored in browser localStorage
- **Material UI Styling**: Consistent design using Material UI components
- **Cookie Categories**: Support for necessary, functional, analytical, and marketing cookies

### Implementation Details

#### Components

- `CookieBanner.js`: Main banner component with Material UI styling
- `useCookieConsent.js`: Custom React hook for managing consent state
- `cookieConsent.js`: Utility functions for localStorage operations

#### Cookie Categories

1. **Necessary**: Essential cookies (always enabled)
2. **Functional**: Enhanced functionality cookies
3. **Analytical**: Usage analytics cookies
4. **Marketing**: Advertising and marketing cookies

### Usage

The cookie banner automatically appears on first visit. User choices are stored in localStorage with the following keys:
- `cookieConsent`: JSON object with consent status for each category
- `cookieConsentTimestamp`: ISO timestamp of when consent was given

### Installation

```bash
cd client
npm install
npm start
```

### Integration

The banner is integrated into the main App component and will display automatically when no consent has been previously given.
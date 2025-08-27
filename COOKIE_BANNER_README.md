# Cookie Banner Implementation

## Overview

This implementation provides a GDPR-compliant cookie consent banner for the client application with the following features:

- **GDPR Compliance**: Meets GDPR requirements for cookie consent
- **Category Management**: Supports four cookie categories (Necessary, Functional, Analytics, Marketing)
- **User Choice**: Accept All or Reject All options
- **Local Storage**: Consent preferences stored in localStorage
- **API Sync**: Authenticated users' preferences sync across devices
- **Bottom Bar Design**: Non-intrusive banner at the bottom of the page

## Files

### Client-Side
- `cookieBanner.js`: Core cookie banner implementation
- `client.html`: Demo page showing the cookie banner in action

### Server-Side
- `cookieConsentAPI.js`: API handler for consent synchronization
- `index.js`: Updated main application with cookie consent integration

## Features

### Cookie Categories

1. **Necessary**: Essential cookies required for website functionality (always enabled)
2. **Functional**: Enhanced functionality and personalization cookies
3. **Analytics**: Website usage and performance tracking cookies
4. **Marketing**: Advertising and targeted marketing cookies

### User Interface

- Bottom bar banner that slides up when shown
- Clean, professional design with clear messaging
- Two primary actions: "Accept All" and "Reject All"
- Responsive design for mobile devices
- Smooth animations for showing/hiding

### Data Storage

**Local Storage**:
- Key: `cookie-consent`
- Structure:
```json
{
  "timestamp": "ISO date string",
  "categories": {
    "necessary": true,
    "functional": true/false,
    "analytics": true/false,
    "marketing": true/false
  },
  "version": "1.0.0"
}
```

### API Endpoints

The implementation includes the following API endpoints:

1. **POST /api/cookie-consent**
   - Save user's consent preferences
   - Body: `{ userId, consent }`

2. **GET /api/cookie-consent/:userId**
   - Retrieve user's consent preferences
   - Returns: `{ consent }`

3. **DELETE /api/cookie-consent/:userId**
   - Remove user's consent data
   - Returns: `{ success: boolean }`

4. **GET /api/cookie-consent-report**
   - Generate compliance report
   - Returns statistics about consent rates

## Usage

### Basic Implementation

```javascript
// Initialize the cookie banner
const cookieBanner = new CookieBanner();
cookieBanner.init();

// For authenticated users
cookieBanner.setUserContext(true, 'user-id-123');
```

### Checking Consent

```javascript
// Check if user has given any consent
if (cookieBanner.hasConsent()) {
  // User has made a choice
}

// Check specific category consent
if (cookieBanner.getCategoryConsent('analytics')) {
  // Load analytics scripts
}
```

### Event Handling

```javascript
// Listen for consent changes
window.addEventListener('cookie-consent-granted', (event) => {
  console.log('Consent granted for:', event.detail.category);
  // Enable relevant scripts/features
});

window.addEventListener('cookie-consent-revoked', (event) => {
  console.log('Consent revoked for:', event.detail.category);
  // Disable relevant scripts/features
});
```

## Testing

1. Open `client.html` in a web browser
2. The cookie banner will appear on first visit
3. Test "Accept All" and "Reject All" buttons
4. Use the test controls to:
   - Reset consent and show banner again
   - View stored consent data
   - Simulate user authentication
   - Test cross-device sync

## Running the Application

```bash
# Run the main application
npm start

# Or directly with Node.js
node index.js
```

## Compliance Notes

- **Explicit Consent**: Users must actively choose to accept or reject cookies
- **Granular Control**: Different categories can be controlled separately
- **Transparency**: Clear descriptions of each cookie category
- **Data Portability**: Consent can be synced across devices for authenticated users
- **Easy Withdrawal**: Users can change their preferences at any time

## Browser Compatibility

The implementation uses standard JavaScript and should work in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Security Considerations

- No sensitive data is stored in cookies or localStorage
- API endpoints should be protected with authentication in production
- HTTPS should be used in production environments
- Consider implementing rate limiting for API endpoints
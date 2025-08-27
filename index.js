const CookieConsentAPI = require('./cookieConsentAPI');

class GirlyGirl {
  constructor() {
    this.version = '1.0.0';
    this.features = [];
    this.cookieConsentAPI = new CookieConsentAPI();
  }

  initialize() {
    console.log('GirlyGirl project initialized');
    console.log(`Version: ${this.version}`);
    console.log('Cookie Consent API initialized');
    return true;
  }

  addFeature(feature) {
    this.features.push(feature);
    console.log(`Feature added: ${feature}`);
  }

  listFeatures() {
    if (this.features.length === 0) {
      console.log('No features added yet');
      return [];
    }
    console.log('Current features:');
    this.features.forEach((feature, index) => {
      console.log(`  ${index + 1}. ${feature}`);
    });
    return this.features;
  }

  handleCookieConsentRequest(method, path, body) {
    return this.cookieConsentAPI.handleRequest(method, path, body);
  }

  getCookieConsentReport() {
    return this.cookieConsentAPI.generateComplianceReport();
  }
}

const app = new GirlyGirl();
app.initialize();
app.addFeature('Initial setup');
app.addFeature('Basic structure');
app.addFeature('GDPR Cookie Banner');
app.addFeature('Cookie Consent Management');
app.addFeature('Cross-device Sync for Authenticated Users');
app.listFeatures();

console.log('\nTesting Cookie Consent API:');
const testUserId = 'test-user-123';
const testConsent = {
  categories: {
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  }
};

const saveResult = app.handleCookieConsentRequest('POST', '/api/cookie-consent', {
  userId: testUserId,
  consent: testConsent
});
console.log('Save consent result:', saveResult.data.success ? 'Success' : 'Failed');

const getResult = app.handleCookieConsentRequest('GET', `/api/cookie-consent/${testUserId}`, null);
console.log('Retrieved consent:', getResult.data.consent ? 'Found' : 'Not found');

const report = app.getCookieConsentReport();
console.log('Compliance Report:', report);

module.exports = GirlyGirl;
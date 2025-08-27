class CookieConsentAPI {
  constructor() {
    this.consentStorage = new Map();
  }

  saveUserConsent(userId, consentData) {
    if (!userId || !consentData) {
      throw new Error('User ID and consent data are required');
    }

    const consent = {
      userId,
      timestamp: consentData.timestamp || new Date().toISOString(),
      categories: consentData.categories,
      version: consentData.version || '1.0.0',
      lastUpdated: new Date().toISOString()
    };

    this.consentStorage.set(userId, consent);
    
    console.log(`Cookie consent saved for user ${userId}:`, consent);
    
    return consent;
  }

  getUserConsent(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const consent = this.consentStorage.get(userId);
    
    if (consent) {
      console.log(`Cookie consent retrieved for user ${userId}`);
      return consent;
    }
    
    console.log(`No cookie consent found for user ${userId}`);
    return null;
  }

  deleteUserConsent(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const deleted = this.consentStorage.delete(userId);
    
    if (deleted) {
      console.log(`Cookie consent deleted for user ${userId}`);
    } else {
      console.log(`No cookie consent to delete for user ${userId}`);
    }
    
    return deleted;
  }

  getAllConsents() {
    return Array.from(this.consentStorage.entries()).map(([userId, consent]) => ({
      userId,
      ...consent
    }));
  }

  generateComplianceReport() {
    const consents = this.getAllConsents();
    const report = {
      totalUsers: consents.length,
      timestamp: new Date().toISOString(),
      consentsByCategory: {
        necessary: 0,
        functional: 0,
        analytics: 0,
        marketing: 0
      },
      consentRates: {}
    };

    consents.forEach(consent => {
      if (consent.categories) {
        Object.keys(consent.categories).forEach(category => {
          if (consent.categories[category]) {
            report.consentsByCategory[category]++;
          }
        });
      }
    });

    if (report.totalUsers > 0) {
      Object.keys(report.consentsByCategory).forEach(category => {
        report.consentRates[category] = 
          ((report.consentsByCategory[category] / report.totalUsers) * 100).toFixed(2) + '%';
      });
    }

    return report;
  }

  handleRequest(method, path, body) {
    const pathParts = path.split('/').filter(p => p);
    
    if (method === 'POST' && pathParts[0] === 'api' && pathParts[1] === 'cookie-consent') {
      if (!body || !body.userId || !body.consent) {
        return {
          status: 400,
          data: { error: 'Invalid request body' }
        };
      }
      
      try {
        const consent = this.saveUserConsent(body.userId, body.consent);
        return {
          status: 200,
          data: { success: true, consent }
        };
      } catch (error) {
        return {
          status: 500,
          data: { error: error.message }
        };
      }
    }
    
    if (method === 'GET' && pathParts[0] === 'api' && pathParts[1] === 'cookie-consent' && pathParts[2]) {
      const userId = pathParts[2];
      
      try {
        const consent = this.getUserConsent(userId);
        if (consent) {
          return {
            status: 200,
            data: { consent }
          };
        } else {
          return {
            status: 404,
            data: { error: 'Consent not found' }
          };
        }
      } catch (error) {
        return {
          status: 500,
          data: { error: error.message }
        };
      }
    }
    
    if (method === 'DELETE' && pathParts[0] === 'api' && pathParts[1] === 'cookie-consent' && pathParts[2]) {
      const userId = pathParts[2];
      
      try {
        const deleted = this.deleteUserConsent(userId);
        return {
          status: 200,
          data: { success: deleted }
        };
      } catch (error) {
        return {
          status: 500,
          data: { error: error.message }
        };
      }
    }
    
    if (method === 'GET' && pathParts[0] === 'api' && pathParts[1] === 'cookie-consent-report') {
      const report = this.generateComplianceReport();
      return {
        status: 200,
        data: report
      };
    }
    
    return {
      status: 404,
      data: { error: 'Endpoint not found' }
    };
  }
}

module.exports = CookieConsentAPI;
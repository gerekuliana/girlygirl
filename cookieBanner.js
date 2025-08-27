class CookieBanner {
  constructor() {
    this.consentKey = 'cookie-consent';
    this.consentSyncKey = 'cookie-consent-sync';
    this.categories = {
      necessary: { name: 'Necessary', description: 'Essential for the website to function properly', required: true },
      functional: { name: 'Functional', description: 'Enable enhanced functionality and personalization' },
      analytics: { name: 'Analytics', description: 'Help us understand how visitors interact with the website' },
      marketing: { name: 'Marketing', description: 'Used for targeted advertising and marketing purposes' }
    };
    this.consent = this.loadConsent();
    this.isAuthenticated = false;
    this.userId = null;
  }

  loadConsent() {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(this.consentKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse consent data:', e);
      }
    }
    return null;
  }

  saveConsent(consent) {
    if (typeof window === 'undefined') return;
    
    const consentData = {
      timestamp: new Date().toISOString(),
      categories: consent,
      version: '1.0.0'
    };
    
    localStorage.setItem(this.consentKey, JSON.stringify(consentData));
    this.consent = consentData;
    
    if (this.isAuthenticated && this.userId) {
      this.syncConsentToAPI(consentData);
    }
    
    this.applyConsent(consent);
  }

  async syncConsentToAPI(consentData) {
    if (!this.isAuthenticated || !this.userId) return;
    
    try {
      const response = await fetch('/api/cookie-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          consent: consentData
        })
      });
      
      if (response.ok) {
        localStorage.setItem(this.consentSyncKey, new Date().toISOString());
      }
    } catch (error) {
      console.error('Failed to sync consent to API:', error);
    }
  }

  async loadConsentFromAPI() {
    if (!this.isAuthenticated || !this.userId) return null;
    
    try {
      const response = await fetch(`/api/cookie-consent/${this.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.consent) {
          localStorage.setItem(this.consentKey, JSON.stringify(data.consent));
          this.consent = data.consent;
          return data.consent;
        }
      }
    } catch (error) {
      console.error('Failed to load consent from API:', error);
    }
    return null;
  }

  setUserContext(isAuthenticated, userId) {
    this.isAuthenticated = isAuthenticated;
    this.userId = userId;
    
    if (isAuthenticated && userId) {
      this.loadConsentFromAPI();
    }
  }

  acceptAll() {
    const consent = {};
    Object.keys(this.categories).forEach(key => {
      consent[key] = true;
    });
    this.saveConsent(consent);
  }

  rejectAll() {
    const consent = {};
    Object.keys(this.categories).forEach(key => {
      consent[key] = key === 'necessary';
    });
    this.saveConsent(consent);
  }

  applyConsent(consent) {
    Object.keys(consent).forEach(category => {
      if (consent[category]) {
        this.enableCategory(category);
      } else {
        this.disableCategory(category);
      }
    });
  }

  enableCategory(category) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('cookie-consent-granted', { detail: { category } }));
  }

  disableCategory(category) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('cookie-consent-revoked', { detail: { category } }));
  }

  hasConsent() {
    return this.consent !== null;
  }

  getCategoryConsent(category) {
    if (!this.consent || !this.consent.categories) return false;
    return this.consent.categories[category] === true;
  }

  createBannerHTML() {
    return `
      <div id="cookie-banner" class="cookie-banner">
        <div class="cookie-banner-content">
          <div class="cookie-banner-text">
            <h3>We value your privacy</h3>
            <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies in accordance with GDPR.</p>
            <div class="cookie-categories">
              ${Object.entries(this.categories).map(([key, category]) => `
                <div class="cookie-category">
                  <strong>${category.name}:</strong> ${category.description}
                </div>
              `).join('')}
            </div>
          </div>
          <div class="cookie-banner-actions">
            <button id="cookie-reject-all" class="cookie-btn cookie-btn-secondary">Reject All</button>
            <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary">Accept All</button>
          </div>
        </div>
      </div>
    `;
  }

  createBannerStyles() {
    return `
      <style>
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .cookie-banner-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .cookie-banner-text {
          flex: 1;
          min-width: 300px;
        }

        .cookie-banner-text h3 {
          margin: 0 0 10px 0;
          font-size: 18px;
          color: #333;
        }

        .cookie-banner-text p {
          margin: 0 0 15px 0;
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .cookie-categories {
          display: none;
          margin-top: 10px;
        }

        .cookie-category {
          font-size: 12px;
          color: #777;
          margin: 5px 0;
        }

        .cookie-banner-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .cookie-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          white-space: nowrap;
        }

        .cookie-btn-primary {
          background: #007bff;
          color: white;
        }

        .cookie-btn-primary:hover {
          background: #0056b3;
        }

        .cookie-btn-secondary {
          background: #f8f9fa;
          color: #333;
          border: 1px solid #dee2e6;
        }

        .cookie-btn-secondary:hover {
          background: #e9ecef;
        }

        .cookie-banner.hidden {
          animation: slideDown 0.3s ease-out forwards;
        }

        @keyframes slideDown {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }

        @media (max-width: 768px) {
          .cookie-banner-content {
            flex-direction: column;
          }

          .cookie-banner-actions {
            width: 100%;
            justify-content: stretch;
          }

          .cookie-btn {
            flex: 1;
          }
        }
      </style>
    `;
  }

  init() {
    if (typeof window === 'undefined') return;
    
    if (this.hasConsent()) {
      this.applyConsent(this.consent.categories);
      return;
    }
    
    document.addEventListener('DOMContentLoaded', () => {
      const styleElement = document.createElement('div');
      styleElement.innerHTML = this.createBannerStyles();
      document.head.appendChild(styleElement.firstElementChild);
      
      const bannerElement = document.createElement('div');
      bannerElement.innerHTML = this.createBannerHTML();
      document.body.appendChild(bannerElement.firstElementChild);
      
      document.getElementById('cookie-accept-all').addEventListener('click', () => {
        this.acceptAll();
        this.hideBanner();
      });
      
      document.getElementById('cookie-reject-all').addEventListener('click', () => {
        this.rejectAll();
        this.hideBanner();
      });
    });
  }

  hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.add('hidden');
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CookieBanner;
}

if (typeof window !== 'undefined') {
  window.CookieBanner = CookieBanner;
}
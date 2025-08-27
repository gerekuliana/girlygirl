const CONSENT_KEY = 'cookieConsent';
const CONSENT_TIMESTAMP_KEY = 'cookieConsentTimestamp';

export const COOKIE_CATEGORIES = {
  necessary: {
    name: 'Necessary',
    description: 'Essential for the website to function properly',
    required: true,
  },
  functional: {
    name: 'Functional',
    description: 'Enable enhanced functionality and personalization',
    required: false,
  },
  analytical: {
    name: 'Analytical',
    description: 'Help us understand how visitors interact with the website',
    required: false,
  },
  marketing: {
    name: 'Marketing',
    description: 'Used for advertising and marketing purposes',
    required: false,
  },
};

export const getConsentStatus = () => {
  try {
    const consent = localStorage.getItem(CONSENT_KEY);
    return consent ? JSON.parse(consent) : null;
  } catch (error) {
    console.error('Error reading consent status:', error);
    return null;
  }
};

export const saveConsentStatus = (consent) => {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Error saving consent status:', error);
    return false;
  }
};

export const hasUserConsented = () => {
  return getConsentStatus() !== null;
};

export const acceptAllCookies = () => {
  const consent = {
    necessary: true,
    functional: true,
    analytical: true,
    marketing: true,
  };
  return saveConsentStatus(consent);
};

export const rejectAllCookies = () => {
  const consent = {
    necessary: true,
    functional: false,
    analytical: false,
    marketing: false,
  };
  return saveConsentStatus(consent);
};

export const clearConsentStatus = () => {
  try {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing consent status:', error);
    return false;
  }
};
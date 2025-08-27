import { useState, useEffect } from 'react';
import {
  getConsentStatus,
  saveConsentStatus,
  hasUserConsented,
  acceptAllCookies,
  rejectAllCookies,
} from '../utils/cookieConsent';

const useCookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [consentStatus, setConsentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConsent = () => {
      const hasConsent = hasUserConsented();
      const consent = getConsentStatus();
      
      setConsentStatus(consent);
      setShowBanner(!hasConsent);
      setLoading(false);
    };

    checkConsent();
  }, []);

  const handleAcceptAll = () => {
    const success = acceptAllCookies();
    if (success) {
      setConsentStatus(getConsentStatus());
      setShowBanner(false);
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
        detail: { action: 'acceptAll' }
      }));
    }
  };

  const handleRejectAll = () => {
    const success = rejectAllCookies();
    if (success) {
      setConsentStatus(getConsentStatus());
      setShowBanner(false);
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
        detail: { action: 'rejectAll' }
      }));
    }
  };

  const updateConsent = (newConsent) => {
    const success = saveConsentStatus(newConsent);
    if (success) {
      setConsentStatus(newConsent);
      setShowBanner(false);
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
        detail: { action: 'custom', consent: newConsent }
      }));
    }
  };

  return {
    showBanner,
    consentStatus,
    loading,
    handleAcceptAll,
    handleRejectAll,
    updateConsent,
    setShowBanner,
  };
};

export default useCookieConsent;
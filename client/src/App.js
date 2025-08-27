import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Box, Container, Typography, Paper } from '@mui/material';
import CookieBanner from './components/CookieBanner';
import useCookieConsent from './hooks/useCookieConsent';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { 
    showBanner, 
    consentStatus,
    loading,
    handleAcceptAll, 
    handleRejectAll 
  } = useCookieConsent();

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            GirlyGirl Client App
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Welcome to the client application
          </Typography>
          
          {consentStatus && (
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Current Cookie Consent Status:
              </Typography>
              <Box component="ul" sx={{ mt: 2 }}>
                <Typography component="li" variant="body1">
                  Necessary cookies: {consentStatus.necessary ? 'Accepted' : 'Rejected'}
                </Typography>
                <Typography component="li" variant="body1">
                  Functional cookies: {consentStatus.functional ? 'Accepted' : 'Rejected'}
                </Typography>
                <Typography component="li" variant="body1">
                  Analytical cookies: {consentStatus.analytical ? 'Accepted' : 'Rejected'}
                </Typography>
                <Typography component="li" variant="body1">
                  Marketing cookies: {consentStatus.marketing ? 'Accepted' : 'Rejected'}
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      </Container>
      
      <CookieBanner 
        show={showBanner}
        onAccept={handleAcceptAll}
        onReject={handleRejectAll}
      />
    </ThemeProvider>
  );
}

export default App;
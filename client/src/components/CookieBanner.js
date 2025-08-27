import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Fade,
  Container,
  Link,
} from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';

const CookieBanner = ({ onAccept, onReject, show }) => {
  if (!show) return null;

  return (
    <Fade in={show} timeout={500}>
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          borderRadius: '16px 16px 0 0',
          backgroundColor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              py: 3,
              px: { xs: 2, sm: 3 },
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              alignItems={{ xs: 'stretch', md: 'center' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                <CookieIcon 
                  sx={{ 
                    mr: 2, 
                    mt: 0.5,
                    color: 'primary.main',
                    fontSize: 28
                  }} 
                />
                <Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Cookie Consent
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    We use cookies to enhance your browsing experience and analyze site traffic. 
                    By clicking "Accept All", you consent to our use of cookies for necessary, 
                    functional, analytical, and marketing purposes.
                  </Typography>
                  <Link 
                    href="#" 
                    variant="body2"
                    underline="hover"
                    onClick={(e) => e.preventDefault()}
                  >
                    Learn more about our cookie policy
                  </Link>
                </Box>
              </Box>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                sx={{ minWidth: { md: 'auto' }, width: { xs: '100%', sm: 'auto' } }}
              >
                <Button
                  variant="outlined"
                  onClick={onReject}
                  size="large"
                  sx={{
                    minWidth: 120,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Reject All
                </Button>
                <Button
                  variant="contained"
                  onClick={onAccept}
                  size="large"
                  sx={{
                    minWidth: 120,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  Accept All
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Paper>
    </Fade>
  );
};

export default CookieBanner;
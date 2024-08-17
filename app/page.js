'use client';

import getStripe from '@/utils/get-stripe';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Container, AppBar, Typography, Toolbar, Button, Box, Grid } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSubmit = async (priceId) => { 
    console.log(`Price ID: ${priceId} clicked`);
    try {
      const checkoutSession = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });
  
      const checkoutSessionJson = await checkoutSession.json();
      console.log(checkoutSessionJson);
  
      if (checkoutSessionJson.id) {
        router.push(`/results?session_id=${checkoutSessionJson.id}`);
      } else {
        console.warn('Failed to create checkout session.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static" sx={{ mb: 4, backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant='h6' sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in" sx={{ ml: 1 }}>Login</Button>
            <Button color="inherit" href="/sign-up" sx={{ ml: 1 }}>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant='h2' gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>Welcome to Flashcard SaaS</Typography>
        <Typography variant='h5' gutterBottom sx={{ color: '#555' }}>
          The easiest way to create flashcards from scratch
        </Typography>
        <Button variant='contained' color='primary' sx={{ mt: 3, px: 5, py: 1.5 }}>
          Get Started
        </Button>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, textAlign: 'center', borderRadius: 2, backgroundColor: '#f5f5f5', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
              <Typography variant='h6' gutterBottom>Easy Text Input</Typography>
              <Typography>
                Simply input your text and let our software do the rest. Creating
                flashcards has never been easier.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, textAlign: 'center', borderRadius: 2, backgroundColor: '#f5f5f5', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
              <Typography variant='h6' gutterBottom>Smart Flashcards</Typography>
              <Typography>
                Our AI intelligently breaks down your text into concise flashcards,
                perfect for studying.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, textAlign: 'center', borderRadius: 2, backgroundColor: '#f5f5f5', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
              <Typography variant='h6' gutterBottom>Accessible Anywhere</Typography>
              <Typography>
                Access your flashcards from any device, at any time.
                Study on the go with ease.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              border: '2px solid',
              borderColor: 'grey.300',
              backgroundColor: '#fff',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Basic</Typography>
              <Typography variant='h5' sx={{ color: '#1976d2', mt: 1 }}>$5 / month</Typography>
              <Typography sx={{ mt: 2 }}>
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button 
                variant='contained' 
                color='primary' 
                sx={{ mt: 3, px: 4, py: 1.5 }}
                onClick={() => handleSubmit('price_basic')}>
                Choose Basic
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              border: '2px solid',
              borderColor: 'grey.300',
              backgroundColor: '#fff',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Pro</Typography>
              <Typography variant='h5' sx={{ color: '#1976d2', mt: 1 }}>$10 / month</Typography>
              <Typography sx={{ mt: 2 }}>
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button 
                variant='contained' 
                color='primary' 
                sx={{ mt: 3, px: 4, py: 1.5 }}
                onClick={() => handleSubmit('price_pro')}>
                Choose Pro
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              border: '2px solid',
              borderColor: 'grey.300',
              backgroundColor: '#fff',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Premium</Typography>
              <Typography variant='h5' sx={{ color: '#1976d2', mt: 1 }}>$20 / month</Typography>
              <Typography sx={{ mt: 2 }}>
                All Pro features, plus advanced analytics and custom branding.
              </Typography>
              <Button 
                variant='contained' 
                color='primary' 
                sx={{ mt: 3, px: 4, py: 1.5 }}
                onClick={() => handleSubmit('price_premium')}>
                Choose Premium
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

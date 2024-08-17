'use client';

import getStripe from '@/utils/get-stripe';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Container, AppBar, Typography, Toolbar, Button, Box, Grid } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Home() {
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (priceId) => { 
    console.log(`Price ID: ${priceId} clicked`);
    try {
      const checkoutSession = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }), // Pass priceId in the request body
      });
  
      const checkoutSessionJson = await checkoutSession.json();
      console.log(checkoutSessionJson); // Log the session data to check if it was created successfully
  
      if (checkoutSessionJson.id) {
        router.push(`/results?session_id=${checkoutSessionJson.id}`); // Redirect to the results page with session ID
      } else {
        console.warn('Failed to create checkout session.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant='h6' style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant='h2' gutterBottom>Welcome to Flashcard SaaS</Typography>
        <Typography variant='h5' gutterBottom>
          The easiest way to create flashcards from scratch
        </Typography>
        <Button variant='contained' color='primary' sx={{ mt: 2 }}>
          Get Started
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant='h4' gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant='h6' gutterBottom>Easy Text Input</Typography>
            <Typography>
              Simply input your text and let our software do the rest. Creating
              flashcards has never been easier.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='h6' gutterBottom>Smart Flashcards</Typography>
            <Typography>
              Our AI intelligently breaks down your text into concise flashcards,
              perfect for studying.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='h6' gutterBottom>Accessible Anywhere</Typography>
            <Typography>
              Access your flashcards from any device, at any time.
              Study on the go with ease.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant='h4'>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant='h6'>Basic</Typography>
              <Typography>$5 / month</Typography>
              <Typography>
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button 
                variant='contained' 
                color='primary' 
                sx={{ mt: 2 }}
                onClick={() => handleSubmit('price_basic')}> {/* Pass the price ID */}
                Choose Basic
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant='h6'>Pro</Typography>
              <Typography>$10 / month</Typography>
              <Typography>
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button 
                variant='contained' 
                color='primary' 
                sx={{ mt: 2 }}
                onClick={() => handleSubmit('price_pro')}> {/* Pass the price ID */}
                Choose Pro 
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant='h6'>Premium</Typography>
              <Typography>$20 / month</Typography>
              <Typography>
                All Pro features, plus advanced analytics and custom branding.
              </Typography>
              <Button 
                variant='contained' 
                color='primary' 
                sx={{ mt: 2 }}
                onClick={() => handleSubmit('price_premium')}> {/* Pass the price ID */}
                Choose Premium
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

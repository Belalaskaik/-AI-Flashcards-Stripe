'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { CircularProgress, Container, Typography, Box, Button, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return;

            try {
                const res = await fetch(`/api/checkout_session?session_id=${session_id}`);
                const sessionData = await res.json();
                if (res.ok) {
                    setSession(sessionData);
                } else {
                    setError(sessionData.error);
                }
            } catch (err) {
                console.log(err);
                setError('An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchCheckoutSession();
    }, [session_id]);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <ErrorOutlineIcon color="error" sx={{ fontSize: 48 }} />
                    <Typography variant="h5" color="error" sx={{ mt: 2 }}>
                        Payment Failed
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        Your payment was not successful. Please try again.
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 4 }} onClick={() => router.push('/')}>
                        Return to Home
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 48 }} />
                <Typography variant="h4" sx={{ mt: 2 }}>
                    Thank you for your purchase!
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    We have received your payment. You will receive an email with the order details shortly.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 4 }} onClick={() => router.push('/')}>
                    Return to Home
                </Button>
            </Paper>
        </Container>
    );
};

export default ResultPage;

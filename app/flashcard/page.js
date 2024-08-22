'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { Grid, Box, Card, CardActionArea, CardContent, Container, Typography, CircularProgress, AppBar, Toolbar, Button } from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Link from 'next/link'

const theme = createTheme({
    palette: {
        primary: {
            main: '#3e71a1',
        },
        secondary: {
            main: '#f1f1f1',
        },
        background: {
            default: '#f9f9f9',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
})

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [loading, setLoading] = useState(true)

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
            setLoading(false)
        }
        getFlashcard()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <ThemeProvider theme={theme}>
            {/* Navbar */}
            <AppBar position="static" sx={{ bgcolor: '#3e71a1', mb: 4 }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        My Flashcards
                    </Typography>
                    <Button color="inherit" component={Link} href="/">
                        Home
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md">
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ borderRadius: 2, boxShadow: 4 }}>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box',
                                                        backgroundColor: '#f1f1f1',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        wordWrap: 'break-word',
                                                    },
                                                    '& > div > .back': {
                                                        transform: 'rotateY(180deg)',
                                                        backgroundColor: '#f1f1f1',
                                                        color: '#333',
                                                    },
                                                }}
                                            >
                                                <div style={{ transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                                                    <div className="front">
                                                        <Typography
                                                            variant="h6"
                                                            component="div"
                                                            color="primary"
                                                            sx={{ fontWeight: 'bold', textAlign: 'center' }}
                                                        >
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div className="back">
                                                        <Typography
                                                            variant="h6"
                                                            component="div"
                                                            color="primary"
                                                            sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '0.875rem' }}
                                                        >
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </ThemeProvider>
    )
}

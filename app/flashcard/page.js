'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { doc, getDocs, collection } from 'firebase/firestore'
import { db } from '../../firebase'
import { useSearchParams } from 'next/navigation'
import { Container, Grid, Card, CardActionArea, CardContent, Box, Typography } from '@mui/material'

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
  
    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
          if (!search || !user) return

          console.log("Fetching flashcards for set:", search);

          const colRef = collection(doc(collection(db, 'users'), user.id), 'flashcardSets', search, 'cards')
          const docs = await getDocs(colRef)
          const flashcards = []
          docs.forEach((doc) => {
            flashcards.push({ id: doc.id, ...doc.data() })
          })

          if (flashcards.length > 0) {
            console.log("Flashcards found:", flashcards);
          } else {
            console.log("No flashcards found for set:", search);
          }

          setFlashcards(flashcards)
        }
        getFlashcard()
      }, [search, user])

      const handleCardClick = (id) => {
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }))
      }

      return (
        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.length === 0 ? (
              <Typography>No flashcards found.</Typography>
            ) : (
              flashcards.map((flashcard) => (
                <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                  <Card>
                    <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                      <CardContent>
                        <Box>
                          <Typography variant="h5" component="div">
                            {flipped[flashcard.id] ? flashcard.back : flashcard.front}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      )
}

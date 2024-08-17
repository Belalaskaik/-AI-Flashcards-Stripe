'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc, collection } from 'firebase/firestore' 
import { db } from '../../firebase'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material'

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcardSets, setFlashcardSets] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
          if (!user) return

          console.log("Fetching flashcards for user:", user.id);

          const docRef = doc(collection(db, 'users'), user.id)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            console.log("Document found:", docSnap.data());
            const collections = docSnap.data().flashcardSets || [] 
            setFlashcardSets(collections)
          } else {
            console.log("No document found. Initializing empty flashcardSets array.");
            await setDoc(docRef, { flashcardSets: [] })
          }
        }
        getFlashcards()
      }, [user])

      const handleCardClick = (name) => {
        console.log("Navigating to flashcard set:", name);
        router.push(`/flashcard?id=${name}`)
      }

      return (
        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcardSets.length === 0 ? (
              <Typography>No flashcard sets found.</Typography>
            ) : (
              flashcardSets.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                      <CardContent>
                        <Typography variant="h5" component="div">
                          {flashcard.name}
                        </Typography>
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

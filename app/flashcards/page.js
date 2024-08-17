'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc, collection } from 'firebase/firestore' // Import the necessary Firestore functions
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

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
          if (!user) return
          const docRef = doc(collection(db, 'users'), user.id)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const collections = docSnap.data().flashcardSets || [] // Adjust to your data structure
            setFlashcards(collections)
          } else {
            await setDoc(docRef, { flashcardSets: [] }) // Adjust to your data structure
          }
        }
        getFlashcards()
      }, [user])

      const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
      }

      return (
        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard, index) => (
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
            ))}
          </Grid>
        </Container>
      )
}

'use client'

import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress
} from '@mui/material'
import { useRouter } from 'next/navigation' // Updated import for useRouter
import { doc, getDoc, writeBatch, collection } from 'firebase/firestore' // Import Firestore functions
import { db } from '../../firebase';

export default function Generate() {
    const [setName, setSetName] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleOpenDialog = () => setDialogOpen(true)
    const handleCloseDialog = () => setDialogOpen(false)

    const [text, setText] = useState('')
    const [flashcards, setFlashcards] = useState([])
    const [flippedCards, setFlippedCards] = useState([])
    const [loading, setLoading] = useState(false) // Track loading state

    const router = useRouter(); // Initialize router for redirection

    const saveFlashcards = async () => {
        if (!setName.trim()) {
          alert('Please enter a name for your flashcard set.')
          return
        }
      
        try {
          // Assuming you have user authentication and user.id is available
          const userId = "your-user-id"; // Replace with the actual user ID from Firebase Authentication
          const userDocRef = doc(collection(db, 'users'), userId)
          const userDocSnap = await getDoc(userDocRef)
      
          const batch = writeBatch(db)
      
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data()
            const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
            batch.update(userDocRef, { flashcardSets: updatedSets })
          } else {
            batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
          }
      
          const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
          batch.set(setDocRef, { flashcards })
      
          await batch.commit()
      
          // alert('Flashcards saved successfully!')
          handleCloseDialog()
          setSetName('')

          // Redirect to the flashcards page after saving
          router.push('/flashcards')

        } catch (error) {
          console.error('Error saving flashcards:', error)
          alert('An error occurred while saving flashcards. Please try again.')
        }
      }
      
  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }

    setLoading(true) // Set loading state to true

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
  
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
  
      const data = await response.json()
      setFlashcards(data)
      setFlippedCards(new Array(data.length).fill(false)) // Initialize flippedCards state
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    } finally {
      setLoading(false) // Set loading state to false after flashcards are generated
    }
  }

  const handleCardClick = (index) => {
    const newFlippedCards = [...flippedCards]
    newFlippedCards[index] = !newFlippedCards[index]
    setFlippedCards(newFlippedCards)
  }

    return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          disabled={loading} // Disable button while loading
        >
          Generate Flashcards
        </Button>
        
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading...</Typography>
        </Box>
      ) : (
        flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
              Generated Flashcards
              </Typography>
              <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card onClick={() => handleCardClick(index)} sx={{ height: 200 }}>
                      <CardActionArea sx={{ height: '100%' }}>
                        <CardContent
                          sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            fontFamily: "'Raleway', sans-serif",
                            fontSize: '1.25rem',
                            color: '#333',
                            padding: 2,
                            backgroundColor: flippedCards[index] ? '#f5f5f5' : '#ffffff',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            borderRadius: 2
                          }}
                        >
                          <Typography variant="body1">
                            {flippedCards[index] ? flashcard.back : flashcard.front}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
              ))}
              </Grid>
          </Box>
        )
      )}
      
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Save Flashcard Set</DialogTitle>
          <DialogContent>
              <DialogContentText>
              Please enter a name for your flashcard set.
              </DialogContentText>
              <TextField
              autoFocus
              margin="dense"
              label="Set Name"
              type="text"
              fullWidth
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              />
          </DialogContent>
          <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={saveFlashcards} color="primary">
              Save
              </Button>
          </DialogActions>
      </Dialog>

      {flashcards.length > 0 && (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Save Flashcards
          </Button>
      </Box>
      )}

    </Container>
  )
}

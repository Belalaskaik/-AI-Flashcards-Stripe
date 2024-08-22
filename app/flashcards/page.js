'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button, Card, CardActionArea, CardContent, Container, Grid, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, CircularProgress, AppBar, Toolbar, Box } from "@mui/material"; 
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
        fontWeightBold: 700, // Added bold weight for consistency
    },
})

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(Array(flashcards.length).fill(null));
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFlashcard, setSelectedFlashcard] = useState(null);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        const docRef = doc(collection(db, 'users'), user.id);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                setFlashcards(collections);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    const handleMenuClick = (event, index) => {
        event.stopPropagation();
        const newMenuAnchor = [...menuAnchor];
        newMenuAnchor[index] = event.currentTarget;
        setMenuAnchor(newMenuAnchor);
    };

    const handleMenuClose = (event, index) => {
        event.stopPropagation();
        const newMenuAnchor = [...menuAnchor];
        newMenuAnchor[index] = null;
        setMenuAnchor(newMenuAnchor);
    };

    const handleEditName = (event, flashcard) => {
        event.stopPropagation();
        setSelectedFlashcard(flashcard);
        setNewName(flashcard.name);
        setEditDialogOpen(true);
    };

    const handleDelete = (event, flashcard) => {
        event.stopPropagation();
        setSelectedFlashcard(flashcard);
        setDeleteDialogOpen(true);
    };

    const saveEditedName = async () => {
        if (!newName || !selectedFlashcard) return;

        const docRef = doc(collection(db, 'users'), user.id);
        const oldCollectionRef = collection(docRef, selectedFlashcard.name);
        const newCollectionRef = collection(docRef, newName);

        const oldDocsSnapshot = await getDocs(oldCollectionRef);

        for (const oldDoc of oldDocsSnapshot.docs) {
            const newDocRef = doc(newCollectionRef, oldDoc.id);
            await setDoc(newDocRef, oldDoc.data());
        }

        for (const oldDoc of oldDocsSnapshot.docs) {
            await deleteDoc(doc(oldCollectionRef, oldDoc.id));
        }

        const updatedFlashcards = flashcards.map(flashcard => {
            if (flashcard.name === selectedFlashcard.name) {
                return { ...flashcard, name: newName.charAt(0).toUpperCase() + newName.slice(1) };
            }
            return flashcard;
        });

        await updateDoc(docRef, { flashcards: updatedFlashcards });

        setFlashcards(updatedFlashcards);
        setEditDialogOpen(false);
    };

    const confirmDelete = async () => {
        if (!selectedFlashcard) return;

        const docRef = doc(collection(db, 'users'), user.id);
        const collectionRef = collection(docRef, selectedFlashcard.name);

        const docsSnapshot = await getDocs(collectionRef);
        for (const doc of docsSnapshot.docs) {
            await deleteDoc(doc.ref);
        }

        const updatedFlashcards = flashcards.filter(flashcard => flashcard.name !== selectedFlashcard.name);
        await updateDoc(docRef, { flashcards: updatedFlashcards });

        setFlashcards(updatedFlashcards);
        setDeleteDialogOpen(false);
    };

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
                                    <CardActionArea
                                        onClick={() => {
                                            handleCardClick(flashcard.name);
                                        }}
                                    >
                                        <CardContent sx={{ padding: '24px' }}>
                                            <Box
                                                sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        backgroundColor: '#f1f1f1',
                                                        borderRadius: 0, // Square corners
                                                        boxShadow: 1,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        textAlign: 'center',
                                                        padding: 2,
                                                        border: '1px solid #e0e0e0',
                                                        color: '#3e71a1',
                                                        fontWeight: 'bold',
                                                        textTransform: 'capitalize',
                                                    },
                                                }}
                                            >
                                                <div>
                                                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}> {/* Added bold */}
                                                        {flashcard.name}
                                                    </Typography>
                                                </div>
                                            </Box>
                                        </CardContent>
                                            <IconButton
                                                aria-label="more"
                                                aria-controls={`menu-${index}`}
                                                aria-haspopup="true"
                                                onClick={(event) => handleMenuClick(event, index)}
                                                sx={{ position: 'absolute', top: -5, right: -5 }} // Adjusted to move more to the top right
                                            >
                                                <MoreVertIcon />
                                            </IconButton>

                                        <Menu
                                            id={`menu-${index}`}
                                            anchorEl={menuAnchor[index]}
                                            open={Boolean(menuAnchor[index])}
                                            onClose={(event) => handleMenuClose(event, index)}
                                        >
                                            <MenuItem onClick={(event) => handleEditName(event, flashcard)}>Edit Title</MenuItem>
                                            <MenuItem onClick={(event) => handleDelete(event, flashcard)}>Delete</MenuItem>
                                        </Menu>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Edit Name Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Flashcard Set Name</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a new name for the flashcard set.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Name"
                        type="text"
                        fullWidth
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={saveEditedName} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Flashcard Set</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the flashcard set "{selectedFlashcard?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

'use client'

// import styles from "./page.module.css"
import { useState, useEffect } from 'react'
import { Container, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

// Define the custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Custom primary color
    },
    secondary: {
      main: '#dc004e', // Custom secondary color
    },
    background: {
      default: '#000', // Custom background color
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Custom font
    h4: {
      fontWeight: 700, // Custom font weight for h4
    },
    button: {
      textTransform: 'none', // Disable uppercase transformation for buttons
    },
  },
})

const style = {
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}


export default function Home() {

  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(0)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          bgcolor="background.default"
          padding={4}
        >
          <Typography variant="h2" color="primary" align="center" gutterBottom> PANtrack </Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add New Item
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Item</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Item"
                type="text"
                fullWidth
                variant="outlined"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
                color="primary"
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>
          <Box mt={4} width="100%">
            <Typography variant="h4" align="center" gutterBottom>
              Inventory Items
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map(({ name, quantity }) => (
                    <TableRow key={name}>
                      <TableCell component="th" scope="row">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </TableCell>
                      <TableCell align="right">{quantity}</TableCell>
                      <TableCell align="right">
                      <Stack direction={"row-reverse"} spacing={2}>
                          <Button variant="contained" color="secondary" onClick={() => removeItem(name)}>
                            Remove
                          </Button>
                          <Button variant="contained" color="primary" onClick={() => addItem(name)}>
                            Add
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
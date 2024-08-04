'use client'

import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { Box, Typography, Modal, Stack, TextField, Button, IconButton, useTheme } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc, increment } from "firebase/firestore";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme(); // Ensure theme is correctly used

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, { quantity: increment(1) }, { merge: true });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: increment(-1) }, { merge: true });
      }
    }
    await updateInventory();
  };

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    updateInventory();
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
      sx={{
        backgroundImage: 'url(/img/img.png)', // Ensure the correct path to your image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="#c5ba76"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6" fontSize={16}>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              variant="contained"
              color="error"
            >ADD</Button>
          </Stack>
        </Box>
      </Modal>

      <Stack direction="row" spacing={2} alignItems="center" width="800px" color="#000000" fontSize={80} bgcolor="#f2efa6">
        <TextField
          variant="outlined"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth     
        />
        <Button
          variant="contained"
          color="error"
          onClick={handleOpen}
          startIcon={<AddIcon />}
        >
          Item
        </Button>
      </Stack>

      <Box
        border="1px solid #333"
        width="800px"
        p={2}
        bgcolor="#f2efa6"
        borderRadius={2}
        boxShadow={2}
      >
        <Box
          width="100%"
          height="80px"
          bgcolor="#c5ba76"
          display="flex"
          
          alignItems="center"
          justifyContent="center"
          borderRadius={1}
          mb={2}
        >
          <Typography
            variant="h4"
            color="#000000"
          >
            Pantry List
          </Typography>
        </Box>

        <Stack
          width="100%"
          height="400px"
          spacing={2}
          overflow="auto"
          p={2}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="80px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#c5ba76"
              p={2}
              borderRadius={1}
              boxShadow={1}
            >
              <Typography
                variant="h6"
                color='#333'
                textAlign='left'
                flex={1}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h6"
                color='#333'
                textAlign='right'
                flex={1}
              >
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton
                  color="error"
                  onClick={() => addItem(name)}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => removeItem(name)}
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => deleteItem(name)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

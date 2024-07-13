import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function JoinOrCreateRoom({createRoom , joinRoom }) {

  const [enteredRoomNumber , setenteredRoomNumber] = useState(""); 

  function handleRoomNumber(event) {
    const { value } = event.target;
    setenteredRoomNumber(value);  
}

  return (
    <>
      <Box display={'flex'}>
      <Button variant="contained" sx={{ margin: '3px', padding: '10px' }} onClick={createRoom}>
                Create a room
              </Button>
      <TextField
                id="outlined-textarea"
                label="code"
                value={enteredRoomNumber}
                placeholder="Enter code "
                sx={{ width: '55vh', borderRadius: '50px' }}
                onChange={handleRoomNumber}
              />
      <Button variant="contained" sx={{ margin: '3px', padding: '10px' }} onClick={ ()=>{joinRoom(enteredRoomNumber)}} >
                Join
              </Button>
      </Box>
    </>
  )
}

export default JoinOrCreateRoom

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';



function JoinOrCreateRoom({ createRoom, joinRoom }) {

  const [enteredRoomNumber, setenteredRoomNumber] = useState("");
  const [data, setData] = useState([]);
  const [hasError, sethasError] = useState(null);
  const [hasLengthError, sethasLengthError] = useState(null);

  function handleRoomNumber(event) {
    const { value } = event.target;
    setenteredRoomNumber(value);
    if (value.length == 4) {
      sethasLengthError(false);
    }
    else {
      sethasLengthError(true);
    }
  }

  useEffect(() => {
    console.log("In effect ", data.code);
    if (data.code === '9999') {
      sethasError(true);
    } else {
      sethasError(false);
    }
  }, [data])

  const validateRoomList = async () => {
    if (enteredRoomNumber.length === 4) {
      console.log("^^^^ In use effect ^^^^")
      try {
        const data = await (await fetch(`http://localhost:8085/validateRoomNumber/${enteredRoomNumber}`)).json()
        setData(data)
      } catch (err) {
        console.log(err.message)
      }
    }
    console.log("$$$$$ In use hook $$$$$$", data);
  }

  function validateRoom(enteredRoomNumber) {
    joinRoom(enteredRoomNumber)

  }

  return (


    <Box display={'flex'} justifyContent={'center'}>
      <div style={{ margin: '20rem' }}>
        <Button variant="contained" sx={{ margin: '3px', padding: '10px' }} onClick={createRoom}>
          Create a room
        </Button>
        <TextField
          id="outlined-textarea"
          label="code"
          value={enteredRoomNumber}
          placeholder="Enter code "
          sx={{ maxWidth: '65vh', borderRadius: '50px' }}
          onChange={handleRoomNumber}
          onBlur={validateRoomList}
        />
        <Button variant="contained" sx={{ margin: '3px', padding: '10px' }} onClick={() => { validateRoom(enteredRoomNumber) }} disabled={hasError || hasLengthError} >
          Join
        </Button>
        {hasError && <h2>Error</h2>}
      </div>
    </Box>

  )
}

export default JoinOrCreateRoom

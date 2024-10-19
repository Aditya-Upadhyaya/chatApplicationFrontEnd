import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import AppIcon from '../images/chat-icon.png';
import '../index.css';
import dateFormat, { masks } from "dateformat";
import Carousel from './Carousel';


function JoinOrCreateRoom({ createRoom, joinRoom }) {

  const [enteredRoomNumber, setenteredRoomNumber] = useState("");
  const [data, setData] = useState([]);
  const [hasError, sethasError] = useState(null);
  const [hasLengthError, sethasLengthError] = useState(true);
  var [date, setDate] = useState(new Date());


  console.log("Render");


  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 60000)
    return function cleanup() {
      clearInterval(timer)
    }

  });

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
        const data = await (await fetch(`${process.env.REACT_APP_BACKEND_URL}/validateRoomNumber/${enteredRoomNumber}`)).json()
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

  const images = [
    {src:"./images/image1.png"},
    {src:"./images/image2.png"},
    {src:"./images/image3.png"}
  ];
  
  var size = images.length;

  return (


    <Grid container spacing={10}>
      <Grid item xs={6} md={4} maxWidth={'100rem'}>
        <Box sx={{
          textAlign: 'left'
        }}>
          <img src={AppIcon} alt="app icon" width="80" height="80"></img>
          <strong>Connect</strong>
        </Box>
      </Grid>
      <Grid item xs={6} md={8} maxWidth={'100rem'}>
        <Box padding={2} sx={{
          textAlign: 'right',
        }}>
          <strong className='date'>{dateFormat(date, "ddd, mmm dS, yyyy, h:MM TT")}</strong>
        </Box>
      </Grid>
      <Grid item xs={6} md={6} maxWidth={'100rem'} >
        <Box sx={{
          padding: 2, textAlign: 'left', display: 'flex',
          justifyContent:'center',
          alignItems:'center'
        }}>
          <div style={{display:'flex' , flexDirection:'column'}}>
            <div style={{padding:'3px'}}><h1>Chat with others , Group Chat for everyone</h1></div>
            <div style={{padding:'9px'}}><h4 style={{ color: '#444746' }}>Connect, collaborate, and celebrate from anywhere </h4></div>
            <div style={{display:'flex' , flexDirection:'row' , gap:'8px' , flexWrap:'wrap'}}>
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
          </div>
        </Box>
      </Grid>
      <Grid item xs={6} md={6} maxWidth={'100rem'}>
        <Box sx={{
          padding: 2, textAlign: 'center',
        }}>
          <Carousel images={images} size={size}/>
        </Box>
      </Grid>

    </Grid>
    
  )
}

export default JoinOrCreateRoom

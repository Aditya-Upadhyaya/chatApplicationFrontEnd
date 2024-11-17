import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import DBServiceObj from '../services/DBService';
import { Box, Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AppIcon from '../images/chat-icon.png';

function SubmitName({ register, handleUsername, userData, userRoom, joinRoomFlag, updateChatName, setSpinner, spinner, userRoomArray,handleUserEmail }) {

  const [err, setErr] = useState(false);
  
  const handleClick = async () => {
    console.log("Flag value :", joinRoomFlag);
    setSpinner(true);
    if (joinRoomFlag === true) {
      console.log("****In handleClick***", userRoomArray);
      let datafromDB = DBServiceObj.saveJoinedUserInList(userRoomArray, userData.username ,userData.userEmail );
      datafromDB.then((val) => {
        console.log("value from db servcie", val);
        if (val) {
          register();
          updateChatName();
        }
      })
        .catch(error => {
          setErr(true);
          console.error('Error during write:', error.message); // Handle errors
        });
    } else {
      register();
    }
  };

  return (
    <>

      {/* <div id='submitName' className="container p-5 my-auto border border-dark text-black shadow">

        <>
          <div className="p-5">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                aria-label="Enter username"
                aria-describedby="basic-addon2"
                value={userData.username}
                onChange={handleUsername}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleClick}
                >
                  Submit
                </button>
              </div>
            </div>
            {spinner && <div style={{ display: 'flex', flexDirection: 'column', flex: 'flexWrap', alignItems: 'center' }}><CircularProgress size="20px" /><p>Please wait</p></div>}
            {err && <span style={{ color: 'red', marginLeft: '140px', marginTop: '10px' }}>Error in save user</span>}
          </div> 
        </>
      </div>*/}
      <Grid container flexWrap={'wrap'} justifyContent={'center'} flexDirection={'column'} alignContent={'center'} alignItems={'center'}>
        <Grid item sm={6} md={6}>
          <div className="text-center p-3">
            <h2>Chat room</h2>
          </div>
        </Grid>
        <Grid item sm={9} md={6} sx={{width:'100%'}}>
          <Box sx={{
            width: '100%',
            height: '65vh',
            boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
          }} display={'flex'} justifyContent={'space-evenly'} flexDirection={'column'} alignContent={'center'} flexWrap={'wrap'} alignItems={'stretch'}  id='Boxxx'>
            <TextField
                id="outlined-textarea"
                label="Enter email"
                value={userData.userEmail}
                placeholder="Enter email "
                sx={{width:'75%', borderRadius: '50px' }}
                onChange={handleUserEmail}
                size="medium"
              />
               <TextField
                id="outlined-textarea"
                label="Enter username"
                value={userData.username}
                placeholder="Enter username "
                sx={{width:'75%', borderRadius: '50px' }}
                onChange={handleUsername}
              />
              <Button variant="contained" sx={{ margin: '3px', padding: '10px' }} onClick={handleClick} >
                Join
              </Button>
              {spinner && <div style={{ display: 'flex', flexDirection: 'column', flex: 'flexWrap', alignItems: 'center' }}><CircularProgress size="20px" /><p>Please wait</p></div>}
            {err && <span style={{ color: 'red', marginLeft: '140px', marginTop: '10px' }}>Error in save user</span>}
           
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
export default SubmitName;

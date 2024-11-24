import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import DBServiceObj from '../services/DBService';
import { Box, Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AppIcon from '../images/chat-icon.png';

function SubmitName({ register, handleUsername, userData, userRoom, joinRoomFlag, updateChatName, setSpinner, spinner, userRoomArray, handleUserEmail, setalreadyUserFlag }) {

  const [err, setErr] = useState(false);
  const [userIdError, setuserIdError] = useState(false);
  let alreadyUser;

  function validateUser() {
    setuserIdError(false);
    for (let key in userRoomArray.email) {
      if (userRoomArray.email.hasOwnProperty(key)) {
        var value = userRoomArray.email[key];
        //Same username different email ---set error
        if (key.toLowerCase() == userData.username.toLowerCase() && value.toLowerCase() != userData.userEmail.toLowerCase()) {
          console.log("----Username already there");
          setuserIdError(true);
          return false;
        }
        //same email and same username --allow user with pre filled message
        if (key.toLowerCase() == userData.username.toLowerCase() && value.toLowerCase() == userData.userEmail.toLowerCase()) {
          console.log("----SameUser----");
          setalreadyUserFlag(true);
          alreadyUser=true;
          break;
        }
      }
    }
    return true;
  }

  function clearError() {
    setuserIdError(false)
  }

  const handleClick = async () => {
    setSpinner(true);
    

    if (joinRoomFlag === true) {
      let val = validateUser();
    console.log("Flag value :", val);
      if (val) {
        console.log("****In handleClick***", userRoomArray);
        if (!alreadyUser) {
          let datafromDB = DBServiceObj.saveJoinedUserInList(userRoomArray, userData.username, userData.userEmail);
          datafromDB.then((value) => {
          console.log("value from db servcie", value);
          if (value) {
            register();
            updateChatName(userData.username);
          }
          })
            .catch(error => {
              setErr(true);
              console.error('Error during write:', error.message); // Handle errors
            });
        }
        else{
          register();
          updateChatName(userData.username);
        }
      }
      else {
        setSpinner(false);
      }
    } else {
      register();
    }
  };

  return (
    <>
      <Grid container flexWrap={'wrap'} justifyContent={'center'} flexDirection={'column'} alignContent={'center'} alignItems={'center'}>
        <Grid item sm={6} md={6}>
          <div className="text-center p-3">
            <h2>Chat room</h2>
          </div>
        </Grid>
        <Grid item sm={9} md={6} sx={{ width: '100%' }}>
          <Box sx={{
            width: '100%',
            height: '65vh',
            boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
          }} display={'flex'} justifyContent={'space-evenly'} flexDirection={'column'} alignContent={'center'} flexWrap={'wrap'} alignItems={'stretch'} id='Boxxx'>
            <TextField
              id="outlined-textarea"
              label="Enter email"
              value={userData.userEmail}
              placeholder="Enter email "
              sx={{ width: '75%', borderRadius: '50px' }}
              onChange={handleUserEmail}
              size="medium"
              onBlur={clearError}
            />
            <TextField
              id="outlined-textarea"
              label="Enter username"
              value={userData.username}
              placeholder="Enter username "
              sx={{ width: '75%', borderRadius: '50px' }}
              onChange={handleUsername}
              onBlur={clearError}
            />
            <Button variant="contained" sx={{ margin: '3px', padding: '10px' }}
              onClick={handleClick}
            >
              Join
            </Button>
            {spinner && <div style={{ display: 'flex', flexDirection: 'column', flex: 'flexWrap', alignItems: 'center' }}><CircularProgress size="20px" /><p>Please wait</p></div>}
            {err && <span style={{ color: 'red', marginLeft: '140px', marginTop: '10px' }}>Error in save user</span>}
            {userIdError && <span style={{ color: 'red', marginLeft: '140px', marginTop: '10px' }}>Enter different username</span>}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
export default SubmitName;

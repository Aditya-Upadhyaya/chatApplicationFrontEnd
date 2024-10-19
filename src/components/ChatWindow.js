import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';



const useStyles = makeStyles({
  table: {
      minWidth: 650,
  },
  chatSection: {
      width: '100%',
      height: '80vh'
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
      height: '70vh',
      overflowY: 'auto'
  }
});


function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
      sx: {
          bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}




function ChatWindow({ userlist, privateChats, handleMessage, sendPublicMessage, publicChats, tab, handleTab, sendPrivateMesage, msg , userRoom }) {
  useEffect(() => {

  }, [privateChats]);


  useEffect(() => {

  }, [publicChats]);
  useEffect(() => {
    console.log("Tab : ", tab);
  }, [tab]);
  console.log("Userlist in chatWindow : ", userlist);
  
  return (
    <>
      <Box
        my={4}
        alignItems="center"
        gap={4}
        p={5}
        sx={{ border: '2px solid grey', minHeight: '75vh', maxHeight: '100vh', width: '100vw' }}
      >
        <h2>Room Code : {userRoom}</h2>
        <Grid container spacing={2}>
          <Grid item xs={4} sx={{}}>
            <Box sx={{ overflowX: "scroll",p: 2, border: '2px solid grey', minHeight: '75vh', maxHeight: '80vh', minWidth: '10vw' }}>
              {/* {[...userlist].map((val)=>{return(<button>{val}</button>) })} */}
              <Stack spacing={2} sx={{alignContent:'center' , flexWrap:'wrap'}}>
                <Button variant="outlined" sx={{ width: '20vw', minWidth: '10vw' }} onClick={() => { handleTab("CHATROOM") }}>Chatroom</Button>
                {/* {[...privateChats.keys()].map((name, index) => (
                  <Button variant="outlined" key={index} sx={{ width: '20vw', minWidth: '10vw' }} onClick={() => { handleTab(name) }}>{name}</Button>
                ))} */}
                {
                  userlist.map((name, index) => (
                    <Button variant="outlined" key={index} sx={{ width: '20vw', minWidth: '10vw' }} onClick={() => { handleTab(name) }}>{name}</Button>
                  ))
                }
              </Stack>
            </Box>

          </Grid>
          {tab === "CHATROOM" ? <Grid item xs={8} spacing={2}>
            <Box
              sx={{ overflowY: "scroll", p: 2, display: 'flex', border: '2px solid grey', minHeight: '68vh', maxHeight: '80vh', minWidth: '20vw'  }}
            >
              <ul>
                {publicChats.map(function (data, index) {
                  return (
                    <li key={index}>
                      {data.sendername}:  {data.message}
                    </li>
                  )
                })}
              </ul>
            </Box>
            <TextField
              id="outlined-textarea"
              label="Message"
              placeholder="Type your message "
              sx={{minWidth: '10vw', borderRadius: '50px', width: '50vw'}}
              onChange={handleMessage}
              value={msg}

            />

            <Button variant="contained" sx={{ margin: '3px', padding: '10px' }} onClick={sendPublicMessage}>
              Send
            </Button>
          </Grid> : <Grid item xs={8} spacing={2}>
            <Box
              sx={{ overflowY: "scroll", p: 2, display: 'flex', border: '2px solid grey', minHeight: '68vh', maxHeight: '80vh' }}
            >
              <ul>
                {privateChats.get(tab).map(function (data) {
                  return (
                    <li>
                      {data.sendername}:  {data.message}
                    </li>
                  )
                })}
              </ul>
            </Box>
            <TextField
              id="outlined-textarea"
              label="Message"
              placeholder="Type your message "
              sx={{ minWidth: '15vw', borderRadius: '50px', width: '50vw' }}
              onChange={handleMessage}
              value={msg}

            />
            <Button variant="contained" sx={{ margin: '3px', padding: '10px' }} onClick={sendPrivateMesage}>
              Send
            </Button>
          </Grid>}

        </Grid>
      </Box>
    </>
  )
}

export default ChatWindow

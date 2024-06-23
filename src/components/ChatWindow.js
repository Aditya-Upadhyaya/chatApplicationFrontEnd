import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


function ChatWindow({ userlist, privateChats, handleMessage, sendPublicMessage, publicChats, tab, handleTab ,sendPrivateMesage ,msg}) {
  useEffect(() => {

  }, [privateChats]);


  useEffect(() => {

  }, [publicChats]);
  useEffect(() => {
    console.log("Tab : ", tab);
  }, [tab]);



  return (
    <>
      <div className='shadow' style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',


      }}>
        <Box

          my={4}

          alignItems="center"
          gap={4}
          p={5}
          sx={{ border: '2px solid grey', minHeight: '75vh', maxHeight: '100vh', width: '110vh' }}
        >

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ overflowY: "scroll", p: 2, display: 'flex', border: '2px solid grey', minHeight: '75vh', maxHeight: '80vh' }}>
                {/* {[...userlist].map((val)=>{return(<button>{val}</button>) })} */}
                <ul>
                  <Button onClick={() => { handleTab("CHATROOM") }}>Chatroom</Button>
                  {[...privateChats.keys()].map((name, index) => (
                    <Button variant="outlined" key={index} sx={{ width: '20vh' }} onClick={() => { handleTab(name) }}>{name}</Button>
                  ))}

                </ul>
              </Box>
            </Grid>
            {tab==="CHATROOM" ? <Grid item xs={8} spacing={2}>
              <Box
                sx={{ overflowY: "scroll", p: 2, display: 'flex', border: '2px solid grey', minHeight: '68vh', maxHeight: '80vh' }}
              >
                <ul>
                  {publicChats.map(function (data , index) {
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
                multiline
                sx={{ width: '55vh', borderRadius: '50px' }}
                onChange={handleMessage}
                value={msg}

              />
              <Button variant="contained" sx={{ margin: '3px', padding: '10px' }} onClick={sendPublicMessage}>
                Send
              </Button>
            </Grid>:<Grid item xs={8} spacing={2}>
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
                multiline
                sx={{ width: '55vh', borderRadius: '50px' }}
                onChange={handleMessage}
                value={msg}

              />
              <Button variant="contained" sx={{ margin: '3px', padding: '10px' }} onClick={sendPrivateMesage}>
                Send
              </Button>
            </Grid>}
            
          </Grid>
        </Box>
      </div>
    </>


  )
}

export default ChatWindow

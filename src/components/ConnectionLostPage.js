import React from 'react';
import ImageConnectionLost from '../images/lost-wireless-connection-97338.png';
import Button from '@mui/material/Button';


function ConnectionLostPage({handleButtonClick}) {
  return (
    <>
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'}}
        > 
    <img src={ImageConnectionLost}  alt="Connection Lost" width="500" height="600"></img>
    <Button variant="outlined" onClick={() => { handleButtonClick(10) }}>Home</Button>
    </div>
    
    </>
  )
}

export default ConnectionLostPage

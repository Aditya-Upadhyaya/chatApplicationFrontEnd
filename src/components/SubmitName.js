import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function SubmitName({ register, handleUsername, userData, userRoom, joinRoomFlag, updateChatName, setSpinner,spinner }) {

  const [data, setData] = useState({ data: [] });
  const [err, setErr] = useState('');

  const handleClick = async () => {
    console.log("Flag value :", joinRoomFlag);
    setSpinner(true);
    if (joinRoomFlag === true) {
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "roomNumber": `${userRoom}`,
            "creatorName": `${userData.username}`
          })
        };
        const response = await (await fetch(`${process.env.REACT_APP_BACKEND_URL}/joinRoom`, requestOptions)).json()


        console.log('result is: ', JSON.stringify(response, null, 4));

        setData(response);
      } catch (err) {
        console.log('In catch');
        setErr(err.message);
      } finally {
        console.log('In finaly');
        updateChatName();
        register();
      }
    } else {
      register();
    }
  };

  return (
    <>
      <div className="text-center p-3">
        <h2>Chat room</h2>
      </div>

      <div id='submitName' className="container p-5 my-auto border border-dark text-black shadow">

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
            {spinner && <div style={{display:'flex', flexDirection:'column', flex:'flexWrap', alignItems:'center'}}><CircularProgress size="20px" /><p>Please wait</p></div>}
          </div>
        </>
      </div>
    </>
  );
}
export default SubmitName;

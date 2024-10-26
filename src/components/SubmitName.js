import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import DBServiceObj from '../services/DBService';

function SubmitName({ register, handleUsername, userData, userRoom, joinRoomFlag, updateChatName, setSpinner, spinner, userRoomArray }) {

  const [err, setErr] = useState(false);

  const handleClick = async () => {
    console.log("Flag value :", joinRoomFlag);
    setSpinner(true);
    if (joinRoomFlag === true) {

      console.log("****In handleClick***", userRoomArray);
      let datafromDB = DBServiceObj.saveJoinedUserInList(userRoomArray, userData.username);
      datafromDB.then((val) => {
        console.log("value from db servcie", val);
        if (val) {
          setSpinner(false);
          register();
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
            {spinner && <div style={{ display: 'flex', flexDirection: 'column', flex: 'flexWrap', alignItems: 'center' }}><CircularProgress size="20px" /><p>Please wait</p></div>}
            {err && <span style={{ color: 'red', marginLeft: '140px', marginTop: '10px' }}>Error in save user</span>}
          </div>
        </>
      </div>
    </>
  );
}
export default SubmitName;

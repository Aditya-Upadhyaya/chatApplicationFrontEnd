import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from 'react';


function SubmitName({  register, handleUsername , userData , userRoom , joinRoomFlag, updateChatName}) {

  const [data, setData] = useState({data: []});
  const [err, setErr] = useState('');

  const handleClick = async () => {
    console.log("Flag value :" , joinRoomFlag);
    if (joinRoomFlag===true) {
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              "roomNumber" :`${userRoom}`,
              "creatorName" :`${userData.username}`
          })
      };
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/joinRoom`, requestOptions);
  
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
  
        const result = response.json();
  
        console.log('result is: ', JSON.stringify(result, null, 4));
  
        setData(result);
      } catch (err) {
        setErr(err.message);
      } finally {
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

      <div id = 'submitName' className="container p-5 my-auto border border-dark text-black shadow">
        
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
            </div>
          </>
      </div>
    </>
  );
}
export default SubmitName;

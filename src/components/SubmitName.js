import React from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";


function SubmitName({  register, handleUsername , userData}) {

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
                    onClick={register}
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

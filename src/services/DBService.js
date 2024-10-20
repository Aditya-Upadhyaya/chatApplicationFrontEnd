import app from "../firebaseConfig";
import { getDatabase, ref, set, push } from "firebase/database";

const saveUserName = async (roomId, username, updateSpinner) => {
    console.log("****In db service saveUsername - ",roomId," ", username);
    
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "userDetails/roomCode"));
    set(newDocRef, {
      roomId: roomId,
      username : username
    }).then( () => {
      updateSpinner();
    }).catch((error) => {
      alert("error: ", error.message);
    })
}




export default saveUserName 

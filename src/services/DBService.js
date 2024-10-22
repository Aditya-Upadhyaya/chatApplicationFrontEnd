import app from "../firebaseConfig";
import { getDatabase, ref, set, push, get } from "firebase/database";



// const saveUserName = async (roomId, username, updateSpinner) => {
//   console.log("****In db service saveUsername - ", roomId, " ", username);

//   const db = getDatabase(app);
//   const newDocRef = push(ref(db, "userDetails/roomCode"));
//   set(newDocRef, {
//     roomId: roomId,
//     username: username
//   }).then(() => {
//     updateSpinner();
//   }).catch((error) => {
//     alert("error: ", error.message);
//   })
// }

// export const fetchData = async () => {

//   const db = getDatabase(app);
//   const dbRef = ref(db, "userDetails/roomCode");
//   const snapshot = await get(dbRef);
//   if(snapshot.exists()) {
//     return Object.values(snapshot.val());
//   } else {
//     alert("error");
//   }
// }

async function saveUserName(roomId, username, updateSpinner) {
  console.log("****In db service saveUsername - ", roomId, " ", username);

  const db = getDatabase(app);
  const newDocRef = push(ref(db, "userDetails/roomCode"));
  set(newDocRef, {
    roomId: roomId,
    username: username
  }).then(() => {
    updateSpinner();
  }).catch((error) => {
    alert("error: ", error.message);
  })
}


async function fetchData(params) {
  const db = getDatabase(app);
  const dbRef = ref(db, "userDetails/roomCode");
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    return Object.values(snapshot.val());
  } else {
    alert("error");
  }
}


const DBServiceObj = {
  saveUserName : ()=>saveUserName(),
  fetchData : ()=>fetchData()
}


export default DBServiceObj;
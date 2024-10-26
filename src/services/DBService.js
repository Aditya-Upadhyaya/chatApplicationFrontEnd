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
    alert("error in fetch data");
  }
}
const fetchDataWithID = async () => {
  const db = getDatabase(app);
  const dbRef = ref(db, "userDetails/roomCode");
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {

    const myData = snapshot.val();
    const temporaryArray = Object.keys(myData).map(myFireId => {
      return {
        ...myData[myFireId],
        fireBaseId: myFireId
      }
    })
    return temporaryArray;
  } else {
    alert("error in fetch data with id");
  }
}

const saveJoinedUserInList = async (userRoomArray, newUser) => {
  console.log("^^^^^^^In SaveJoinedUser^^^^", userRoomArray.fireBaseId);

  const db = getDatabase(app);
  const newDocRef = ref(db, "userDetails/roomCode/" + userRoomArray.fireBaseId);
  let usernameNew = userRoomArray.username;
  usernameNew.push(newUser);
  console.log("^^^^^^^In SaveJoinedUser^^^^", usernameNew);
  try {
    await set(newDocRef, {
      roomId: userRoomArray.roomId,
      username: usernameNew
    });
    return true;
  } catch (error) {
    throw new Error('Error in save userDetails: ' + error.message);
  }
  // }).then( () => {
  //   console.log("^^^!!!!User save  in save joined user^^^!!!!");
  //   return true;
  // }).catch((error) => {
  //   console.log("^^^!!!!IError in save joined user^^^!!!!", error);
  //   alert("error: in save joined user ", error.message);
  // })
}


const DBServiceObj = {
  saveUserName: (roomId, username, updateSpinner) => saveUserName(roomId, username, updateSpinner),
  fetchData: () => fetchData(),
  fetchDataWithID: () => fetchDataWithID(),
  saveJoinedUserInList: (userRoomArray, newUser) => saveJoinedUserInList(userRoomArray, newUser)
}


export default DBServiceObj;
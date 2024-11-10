import app from "../firebaseConfig";
import { getDatabase, ref, set, push, get } from "firebase/database";
import dateFormat, { masks } from "dateformat";


async function saveUserName(roomId, username, updateSpinner) {
  console.log("****In db service saveUsername - ", roomId, " ", username);

  const db = getDatabase(app);
  const newDocRef = push(ref(db, "userDetails/roomCode"));
  let message ={}
  set(newDocRef, {
    roomId: roomId,
    username: username,
    message:message
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
  const newDocRef = ref(db, "userDetails/roomCode/" + userRoomArray.fireBaseId + "/username");
  let usernameNew = userRoomArray.username;
  usernameNew.push(newUser);
  console.log("^^^^^^^In SaveJoinedUser^^^^", usernameNew);
  try {
    await set(newDocRef, usernameNew);
    return true;
  } catch (error) {
    throw new Error('Error in save userDetails: ' + error.message);
  }
}

const saveSendMessage = async (roomDetail, username, receiver, msg) => {
  console.log("^^^^^^^In saveSendMessage^^^^", roomDetail);
  const db = getDatabase(app);
  let date = new Date();
  const newDocRef = ref(db, "userDetails/roomCode/" + roomDetail.fireBaseId + "/message");
  const newMessage = {
    senderID: username,
    receiverid:receiver,
    text: msg,
    timestamp: dateFormat(date, "ddd, mmm dS, yyyy, h:MM TT")
  };
  try {
    await push(newDocRef, newMessage);
    return true;
  } catch (error) {
    throw new Error('Error in save userDetails: ' + error.message);
  }
}

const getMessage = async (roomDetail) => {
  console.log("^^^^^^^In saveSendMessage^^^^", roomDetail);
  const db = getDatabase(app);
  const newDocRef = ref(db, "userDetails/roomCode/" + roomDetail.fireBaseId + "/message");
  const snapshot = await get(newDocRef);
  if (snapshot.exists()) {
    return Object.values(snapshot.val());
  } else {
    alert("error in fetch data");
  }
}



const DBServiceObj = {
  saveUserName: (roomId, username, updateSpinner) => saveUserName(roomId, username, updateSpinner),
  fetchData: () => fetchData(),
  fetchDataWithID: () => fetchDataWithID(),
  saveJoinedUserInList: (userRoomArray, newUser) => saveJoinedUserInList(userRoomArray, newUser),
  saveSendMessage: (roomDetail, username,receiver, msg) => saveSendMessage(roomDetail, username,receiver, msg),
  getMessage: (roomDetail) => getMessage(roomDetail)
}


export default DBServiceObj;
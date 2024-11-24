import app from "../firebaseConfig";
import { getDatabase, ref, set, push, get, update } from "firebase/database";
import dateFormat, { masks } from "dateformat";


async function saveUserName(roomId, username, updateSpinner, nameUser, emailUser) {
 
  const db = getDatabase(app);
  const newDocRef = push(ref(db, "userDetails/roomCode"));
  let message = {};
  let email = []
  set(newDocRef, {
    roomId: roomId,
    username: username,
    message: message,
    email: email
  }).then(() => {
    const emailPath = `userDetails/roomCode/${newDocRef.key}/email`; // Create the path for the email
    const emailUpdate = {};
    let emailList = {};
    emailList[nameUser] = emailUser;
    emailUpdate[emailPath] = emailList; // Set email value at the correct path
    // Use update() to add the email to the same transaction 
    update(ref(db), emailUpdate);
    updateSpinner();
  }).catch((error) => {
    console.log("In error - ", error);
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

const saveJoinedUserInList = async (userRoomArray, newUser, emailUser) => {
  console.log("^^^^^^^In SaveJoinedUser^^^^", userRoomArray.fireBaseId);

  const db = getDatabase(app);
  const newDocRef = ref(db, "userDetails/roomCode/" + userRoomArray.fireBaseId + "/username");
  const emailPathRef = ref(db,"userDetails/roomCode/"+ userRoomArray.fireBaseId +"/email"); // Create the path for the email   
  let usernameNew = userRoomArray.username;
  usernameNew.push(newUser);
  console.log("^^^^^^^In SaveJoinedUser^^^^", usernameNew);
  try {
    await set(newDocRef, usernameNew).then(()=>{
      let emailList = {};
      emailList[newUser] = emailUser;
      update(emailPathRef, emailList);
    });
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
    sendername: username,
    receivername: receiver,
    message: msg,
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
  console.log("^^^^^^^In getmsg^^^^", roomDetail);
  const db = getDatabase(app);
  const newDocRef = ref(db, "userDetails/roomCode/" + roomDetail.fireBaseId + "/message");
  const snapshot = await get(newDocRef);
  if (snapshot.exists()) {
    return Object.values(snapshot.val());
  } else {
    alert("error in fetch user's message details");
  }
}

const DBServiceObj = {
  saveUserName: (roomId, username, updateSpinner, nameUser, emailUser) => saveUserName(roomId, username, updateSpinner, nameUser, emailUser),
  fetchData: () => fetchData(),
  fetchDataWithID: () => fetchDataWithID(),
  saveJoinedUserInList: (userRoomArray, newUser, emailUser) => saveJoinedUserInList(userRoomArray, newUser, emailUser),
  saveSendMessage: (roomDetail, username, receiver, msg) => saveSendMessage(roomDetail, username, receiver, msg),
  getMessage: (roomDetail) => getMessage(roomDetail)
}

export default DBServiceObj;
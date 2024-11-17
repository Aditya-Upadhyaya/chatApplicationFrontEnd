import React from 'react'
import SubmitName from './SubmitName';
import ChatWindow from './ChatWindow';
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import ConnectionLostPage from './ConnectionLostPage';
import JoinOrCreateRoom from './JoinOrCreateRoom';
import Header from './Header';
import DBServiceObj from '../services/DBService';
import dateFormat, { masks } from "dateformat";

//get msg from db when an existing user loging

var stompclient = null;

function PageWrapper({ page, handleButtonClick, setPage }) {

    const [roomId, setroomId] = useState(new Map());
    const [userRoom, setuserRoom] = useState();
    const [createRoomFlag, setcreateRoomFlag] = useState(false);
    const [joinRoomFlag, setjoinRoomFlag] = useState(false);
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [userlist, setuserlist] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [msg, setmsg] = useState("");
    let [userRoomArray, setuserRoomArray] = useState();
    const [roomDetail, setroomDetail] = useState();
    const [spinner, setSpinner] = useState();
    const [currentUser, setcurrentUser] = useState();
    const [userData, setUserData] = useState({
        username: "",
        receivername: "",
        connected: false,
        message: "",
        userEmail:""
    });


    function updateChatName() {
        console.log("################# IN Update chat method #################", userlist);
        const updatedChats = new Map(privateChats);
        userlist.map((data, index) => (updatedChats.set(data, [])))
        setPrivateChats(updatedChats)
    }

    
    useEffect(() => {
        console.log("In useEffect : with userRoom to get User list");
        if (userRoom) {
            let fetchData = DBServiceObj.fetchDataWithID()
            // Use the Promise to fetch data
            fetchData.then((result) => {
                    result.map(function (data, index) {
                        if (data.roomId == userRoom) {
                          console.log("DB service result - ",data.username);
                            setuserlist(data.username);
                            setroomDetail(data);
                        }
                      })
                })
                .catch((error) => {
                    console.error('Error fetching data:', error)
                })
        }
        console.log("Userlist in useEffect : ", userlist);
    }, [userRoom, privateChats]);


    function handleUsername(event) {
        const { value } = event.target;
        setUserData({ ...userData, username: value });
    }

    function handleUserEmail(event) {
        const { value } = event.target;
        setUserData({ ...userData, userEmail: value });
    }

    function updateSpinner() {
        console.log("***Debug***In update spinner");
        setSpinner(false)
    }

    //Adding db and stopclient in useeffct beacuse of state userRoom
    useEffect(() => {
        if (createRoomFlag === true) {
            console.log("*******In UseEffect *********", userRoom);
            console.log("%%%%Result=", spinner);

            if (!spinner) {
                // Try to set up WebSocket connection with the handshake at "http://localhost:8085/ws"
                let sock = new SockJS(`${process.env.REACT_APP_BACKEND_URL}/ws`);
                // Create a new StompClient object with the WebSocket endpoint
                stompclient = over(sock);
                stompclient.connect({}, onConnected, onError);
                console.log("***Debug***In Use effect after stomp client ");
            }
        }
    }, [userRoom, joinRoomFlag, spinner]);

    function createRoomNumber() {
        let roomNumber = Math.floor(1000 + (Math.random() * 9000));
        roomId.set(userData.username, roomNumber);
        setroomId(new Map(roomId));
        setuserRoom(roomNumber);
        let usernameList = [];
        usernameList.push(userData.username);
        DBServiceObj.saveUserName(roomNumber, usernameList, updateSpinner,  userData.username, userData.userEmail);
        console.log("***Debug***In Use effect after saving db ");
    }

    function register() {
        if (createRoomFlag === true) {
            createRoomNumber();
        }
        console.log("In Register method spinner = ",spinner);
        if (joinRoomFlag === true && !spinner) {
            // Try to set up WebSocket connection with the handshake at "http://localhost:8085/ws"
            let sock = new SockJS(`${process.env.REACT_APP_BACKEND_URL}/ws`);
            // Create a new StompClient object with the WebSocket endpoint
            stompclient = over(sock);
            stompclient.connect({}, onConnected, onError);
        }
    }

    function onConnected() {
        setUserData({ ...userData, connected: true });
        setcurrentUser(userData.username);
        stompclient.subscribe(`/chatroom/public/${userRoom}`, onPulicMessageReceived);
        stompclient.subscribe(
            "/user/" + userData.username + "/private",
            onPrivateMessageReceived
        );
        console.log("***Debug***In on connect ");
        var chatMessage = {
            sendername: userData.username,
            status: "JOIN"
        };
        stompclient.send(`/app/message/${userRoom}`, {}, JSON.stringify(chatMessage));
        console.log("***Debug***In user join");
        
    }


    function onPrivateMessageReceived(payload) {
        console.log("***Debug***In private msg received");
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.sendername)) {
            privateChats.get(payloadData.sendername).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.sendername, list);
            setPrivateChats(new Map(privateChats));
        }

    }

    function onPulicMessageReceived(payload) {
        console.log("***Debug***In public msg received");
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.sendername)) {
                    privateChats.set(payloadData.sendername, []);

                    const updatedChats = new Map(privateChats);
                    console.log("Updated chat - ", updatedChats);
                    userlist.map((data, index) => (updatedChats.set(data, [])))
                    setPrivateChats(updatedChats)
                    console.log('******In JOin inside if Updated*******' , updatedChats);
                    console.log('******In JOin inside publicChats*******' , publicChats);
                }
                console.log("***Debug***In public msg received case");
                setSpinner(false);
                setPage(1);
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                console.log("Public chat - ", publicChats);
                setPublicChats([...publicChats]);

                break;
            default:
                break;
        }
        console.log("***Debug***In public msg received after switch case ");
    }

    function onError() {
        handleButtonClick(2);
        console.log("Error logged");
    }

    const handleMessage = (event) => {
        const { value } = event.target;

        setmsg(value);

        setUserData({ ...userData, "message": value });
    }

    const sendPublicMessage = () => {
        let date = new Date();
        if (stompclient) {
            var chatMessage = {
                sendername: userData.username,
                message: userData.message,
                status: "MESSAGE",
                timestamp: dateFormat(date, "mmm dS, h:MM TT")
            };
            stompclient.send(`/app/message/${userRoom}`, {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
            setmsg("");
            console.log("$$$$$In send msg - ", roomDetail);
            DBServiceObj.saveSendMessage(roomDetail, userData.username,"chatroom",userData.message);
        }
    }

    const sendPrivateMesage = () => {
        let date = new Date();
        if (stompclient) {
            var chatMessage = {
                sendername: userData.username,
                receivername: tab,
                message: userData.message,
                status: "MESSAGE",
                timestamp: dateFormat(date, "mmm dS, h:MM TT")
            };
            if (userData.username !== tab) {
                console.log("$$$$$In priavte msg - ", userData.username);
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompclient.send("/app/privateMessage", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
            setmsg("");
            DBServiceObj.saveSendMessage(roomDetail, userData.username,tab,userData.message);
            console.log("****In send private msg - ", privateChats);
        }
    }

    function handleTab(val) {
        setTab(val);
    }

    function createRoom() {
        //Redirect user to Chat room (first page) where user need to submit name  
        setcreateRoomFlag(true);
        handleButtonClick(0);

    }

    function joinRoom(value) {
        console.log("*********In Join Room ************", value);
        setuserRoom(value);
        handleButtonClick(0);
        setjoinRoomFlag(true);
    }

    switch (page) {
        case 0:
            return (
                <div>
                    <Header></Header>
                    <SubmitName register={register} handleUsername={handleUsername} userData={userData} userRoom={userRoom} joinRoomFlag={joinRoomFlag} 
                    updateChatName={updateChatName} setSpinner={setSpinner} spinner={spinner} userRoomArray={userRoomArray} handleUserEmail={handleUserEmail}/>
                </div>
            )
        case 1:
            return (
                <>
                    <Header></Header>
                    <ChatWindow userlist={userlist}
                        privateChats={privateChats}
                        handleMessage={handleMessage}
                        sendPublicMessage={sendPublicMessage}
                        publicChats={publicChats} tab={tab}
                        handleTab={handleTab} sendPrivateMesage={sendPrivateMesage} msg={msg} userRoom={userRoom} currentUser={currentUser}></ChatWindow>
                </>
            );
        case 2:
            return (
                <>
                    <ConnectionLostPage handleButtonClick={handleButtonClick}></ConnectionLostPage>
                </>
            );
        case 10:
            return (
                <>
                    <JoinOrCreateRoom createRoom={createRoom} joinRoom={joinRoom} setSpinner={setSpinner} spinner={spinner} 
                    setuserRoomArray={setuserRoomArray}></JoinOrCreateRoom>
                </>
            );

        default:
            break;

    }


}

export default PageWrapper

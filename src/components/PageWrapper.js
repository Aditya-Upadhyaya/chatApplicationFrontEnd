import React from 'react'
import SubmitName from './SubmitName';
import ChatWindow from './ChatWindow';
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import ConnectionLostPage from './ConnectionLostPage';
import JoinOrCreateRoom from './JoinOrCreateRoom';
import ChatWindow1 from './ChatWindow1';
import Header from './Header';



var stompclient = null;

function PageWrapper({ page, handleButtonClick }) {

    const [roomId, setroomId] = useState(new Map());
    const [userRoom, setuserRoom] = useState();
    const [createRoomFlag, setcreateRoomFlag] = useState(false);
    const [joinRoomFlag, setjoinRoomFlag] = useState(false);
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [userlist, setuserlist] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [msg, setmsg] = useState("");
    const [userData, setUserData] = useState({
        username: "",
        receivername: "",
        connected: false,
        message: "",
    });
  

    useEffect(() => {
    }, [userData]);

    useEffect(() => {

    }, [tab]);

   

    useEffect(() => {
    }, [roomId]);


    console.log("private chat in PageWrapper : ", privateChats);
    
    function updateChatName() {
        console.log("################# IN Update chat method #################", userlist);
        userlist.map((data , index) => ( privateChats.set(data, [])))
        setPrivateChats([...privateChats])
        
    }

    useEffect(() => {
        console.log("In useEffect : with userRoom");
        if (userRoom) {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },

            };
            const fetchData = () => {
                return new Promise((resolve, reject) => {
                    // Simulate a fetch request
                    fetch(`${process.env.REACT_APP_BACKEND_URL}/getRoomUsername/${userRoom}`, requestOptions)
                        .then((response) => response.json())
                        .then((data) => resolve(data))
                        .catch((error) => reject(error))
                })
            }

            // Use the Promise to fetch data
            fetchData()
                .then((result) => {
                    setuserlist(result)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error)
                })
        }
        console.log("Userlist in useEffect : ", userlist);
    }, [userRoom ,privateChats ]);


    function handleUsername(event) {
        const { value } = event.target;
        setUserData({ ...userData, username: value });
    }


    useEffect(() => {
        if (createRoomFlag === true) {
            console.log("*******In UseEffect *********", userRoom);
            // Try to set up WebSocket connection with the handshake at "http://localhost:8085/ws"
            let sock = new SockJS(`${process.env.REACT_APP_BACKEND_URL}/ws`);
            // Create a new StompClient object with the WebSocket endpoint
            stompclient = over(sock);
            stompclient.connect({}, onConnected, onError);

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "roomNumber": `${userRoom}`,
                    "creatorName": `${userData.username}`
                })
            };
            fetch(`${process.env.REACT_APP_BACKEND_URL}/addRoom`, requestOptions)
                .then(function (response) {
                    userlist.push(userData.username);
                    setuserlist([...userlist]);
                    return response.json()
                })

        }
    }, [userRoom , joinRoomFlag]);

    function register() {
        if (createRoomFlag === true) {
            let roomNumber = Math.floor(1000 + (Math.random() * 9000));
            roomId.set(userData.username, roomNumber);
            setroomId(new Map(roomId));
            setuserRoom(roomNumber);
        }
        if (joinRoomFlag === true) {
            // Try to set up WebSocket connection with the handshake at "http://localhost:8085/ws"
            let sock = new SockJS(`${process.env.REACT_APP_BACKEND_URL}/ws`);
            // Create a new StompClient object with the WebSocket endpoint
            stompclient = over(sock);
            stompclient.connect({}, onConnected, onError);
        }
    }

    function onConnected() {
        setUserData({ ...userData, connected: true });
        stompclient.subscribe(`/chatroom/public/${userRoom}`, onPulicMessageReceived);
        stompclient.subscribe(
            "/user/" + userData.username + "/private",
            onPrivateMessageReceived
        );
        userJoin();
        
    }

    const userJoin = () => {
        var chatMessage = {
            sendername: userData.username,
            status: "JOIN"
        };
        stompclient.send(`/app/message/${userRoom}`, {}, JSON.stringify(chatMessage));
        
    }
    function onPrivateMessageReceived(payload) {
        
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

        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.sendername)) {
                    privateChats.set(payloadData.sendername, []);
                    setPrivateChats(new Map(privateChats));
                    console.log('******In JOin inside if*******');
                }
                console.log('******In JOin *******', payloadData);
                handleButtonClick(1);
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                console.log("Public chat - ", publicChats);
                setPublicChats([...publicChats]);
                break;
            default:
                break;
        }
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
        if (stompclient) {
            var chatMessage = {
                sendername: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            stompclient.send(`/app/message/${userRoom}`, {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
            setmsg("");
        }
    }

    const sendPrivateMesage = () => {
        if (stompclient) {
            var chatMessage = {
                sendername: userData.username,
                receivername: tab,
                message: userData.message,
                status: "MESSAGE"
            };

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompclient.send("/app/privateMessage", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
            setmsg("");
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
                    <SubmitName register={register} handleUsername={handleUsername} userData={userData} userRoom={userRoom} joinRoomFlag={joinRoomFlag} updateChatName={updateChatName}/>
                </div>
            )
        case 1:
            return (
                <>
                    <Header></Header>
                    <ChatWindow1 userlist={userlist}
                        privateChats={privateChats}
                        handleMessage={handleMessage}
                        sendPublicMessage={sendPublicMessage}
                        publicChats={publicChats} tab={tab}
                        handleTab={handleTab} sendPrivateMesage={sendPrivateMesage} msg={msg} userRoom={userRoom}></ChatWindow1>
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
                    <JoinOrCreateRoom createRoom={createRoom} joinRoom={joinRoom}></JoinOrCreateRoom>
                </>
            );

        case 111:
            return(
                <ChatWindow1  userlist={userlist}
                privateChats={privateChats}
                handleMessage={handleMessage}
                sendPublicMessage={sendPublicMessage}
                publicChats={publicChats} tab={tab}
                handleTab={handleTab} sendPrivateMesage={sendPrivateMesage} msg={msg} userRoom={userRoom}></ChatWindow1>
            );

        default:
            break;

    }


}

export default PageWrapper

import React from 'react'
import SubmitName from './SubmitName';
import ChatWindow from './ChatWindow';
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import ConnectionLostPage from './ConnectionLostPage';
import JoinOrCreateRoom from './JoinOrCreateRoom';



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
    }, [msg]);
    useEffect(() => {
    }, [userlist]);
    useEffect(() => {
    }, [roomId]);
    useEffect(() => {
    }, [createRoomFlag]);




    function handleUsername(event) {
        const { value } = event.target;
        setUserData({ ...userData, username: value });
    }



    function handleUserlist(user) {
        userlist.push(user);
        setuserlist([...userlist]);
    }

    useEffect(() => {
        if (createRoomFlag === true) {
            console.log("*******In UseEffect *********", userRoom);
            // Try to set up WebSocket connection with the handshake at "http://localhost:8085/ws"
            let sock = new SockJS("http://localhost:8085/ws");
            // Create a new StompClient object with the WebSocket endpoint
            stompclient = over(sock);
            stompclient.connect({}, onConnected, onError);

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "roomNumber" :`${userRoom}`,
                    "creatorName" :`${userData.username}`
                })
            };
            fetch('http://localhost:8085/addRoom', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
        }

    }, [userRoom]);


    function register() {
        if (createRoomFlag === true) {
            console.log("************** Create romm *************");
            let roomNumber = Math.floor(1000 + (Math.random() * 9000));
            roomId.set(userData.username, roomNumber);
            setroomId(new Map(roomId));
            setuserRoom(roomNumber);
        }
        if (joinRoomFlag === true) {
            // Try to set up WebSocket connection with the handshake at "http://localhost:8085/ws"
            let sock = new SockJS("http://localhost:8085/ws");
            // Create a new StompClient object with the WebSocket endpoint
            stompclient = over(sock);
            stompclient.connect({}, onConnected, onError);
        }
        console.log("************** Create romm ke baad*************", userRoom);

    }



    function onConnected() {
        setUserData({ ...userData, connected: true });
        stompclient.subscribe(`/chatroom/public/${userRoom}`, onPulicMessageReceived);
        stompclient.subscribe(
            "/user/" + userData.username + "/private",
            onPrivateMessageReceived
        );
        userJoin();
        handleButtonClick(1);
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

                }
                handleUserlist(payloadData.sendername)
                // console.log('payloadData received onPulicMessageReceived', payloadData);

                break;
            case "MESSAGE":
                publicChats.push(payloadData);
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
                    <SubmitName register={register} handleUsername={handleUsername} userData={userData} />
                </div>
            )
        case 1:
            return (
                <>
                    <ChatWindow userlist={userlist}
                        privateChats={privateChats}
                        handleMessage={handleMessage}
                        sendPublicMessage={sendPublicMessage}
                        publicChats={publicChats} tab={tab}
                        handleTab={handleTab} sendPrivateMesage={sendPrivateMesage} msg={msg}></ChatWindow>
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
                <div>
                    <JoinOrCreateRoom createRoom={createRoom} joinRoom={joinRoom}></JoinOrCreateRoom>
                </div>
            );

        default:
            break;

    }


}

export default PageWrapper

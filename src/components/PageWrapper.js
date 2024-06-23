import React from 'react'
import ChatRoom from './ChatRoom';
import ChatWindow from './ChatWindow';
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import ConnectionLostPage from './ConnectionLostPage';


var stompclient = null;

function PageWrapper({ page, handleButtonClick }) {
    

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



    function handleUsername(event) {
        const { value } = event.target;
        setUserData({ ...userData, username: value });
    }



    function handleUserlist(user) {
        userlist.push(user);
        setuserlist([...userlist]);
    }


    function register(params) {


        registerUser();
    }

    function registerUser() {

        // Try to set up WebSocket connection with the handshake at "http://localhost:8085/ws"
        let sock = new SockJS("http://localhost:8085/ws");
        // Create a new StompClient object with the WebSocket endpoint
        stompclient = over(sock);
        stompclient.connect({}, onConnected, onError);
        

    }

    function onConnected() {
        setUserData({ ...userData, connected: true });
        stompclient.subscribe("/chatroom/public", onPulicMessageReceived);
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
        stompclient.send("/app/message", {}, JSON.stringify(chatMessage));

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
                console.log('payloadData received onPulicMessageReceived', payloadData);

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
            console.log("Msg that we send", chatMessage);
            stompclient.send("/app/message", {}, JSON.stringify(chatMessage));
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
   

    switch (page) {
        case 0:
            return (
                <div>
                    <ChatRoom register={register} handleUsername={handleUsername} userData={userData} />
                </div>
            )
        case 1:
            return (
                <>
                    <ChatWindow userlist={userlist} privateChats={privateChats} handleMessage={handleMessage} sendPublicMessage={sendPublicMessage} publicChats={publicChats} tab={tab} handleTab={handleTab} sendPrivateMesage={sendPrivateMesage} msg={msg}></ChatWindow>
                </>
            );
        case 2:
            return (
                <>
                <ConnectionLostPage handleButtonClick={handleButtonClick}></ConnectionLostPage>
                </>
            );

        default:
            break;

    }


}

export default PageWrapper

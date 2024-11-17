import React from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { useEffect } from "react";
import { IconButton, Container, styled } from "@mui/material";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});


function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}


const ChatContainer = styled(Paper)(({ theme }) => ({
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
}));

const MessageArea = styled(Box)({
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
});

const MessageBubble = styled(Box)(({ sent }) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    flexDirection: sent ? "row-reverse" : "row",
    maxWidth: "70%",
    alignSelf: sent ? "flex-end" : "flex-start"
}));


const Message = styled(Paper)(({ sent }) => ({
    padding: "12px 16px",
    borderRadius: "16px",
    backgroundColor: sent ? "#1976d2" : "#f5f5b5",
    color: sent ? "#fff" : "#000",
    position: "relative",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
}));

const InputArea = styled(Box)({
    padding: "20px",
    borderTop: "1px solid rgba(0, 0, 0, 0.1)",
    display: "flex",
    gap: "12px",
    alignItems: "center"
});

const TypingIndicator = styled(Box)({
    padding: "8px 16px",
    borderRadius: "16px",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignSelf: "flex-start",
    marginLeft: "48px"
});

const ChatWindow = ({ userlist, privateChats, handleMessage, sendPublicMessage, publicChats, tab, handleTab, sendPrivateMesage, msg, userRoom, currentUser }) => {
    const classes = useStyles();

    console.log("--p---", privateChats);

    console.log("--public---", publicChats);

    useEffect(() => {


        console.log("Tab : ", tab);

    }, [tab]);

    return (
        <div>

            <Grid container component={Paper} className={classes.chatSection} style={{ height: '100%' }}>
                <Grid item xs={5} md={2} className={classes.borderRight500}>
                    <Divider />
                    <List>
                        <ListItem button id="chatroomButton" alignItems='center' sx={{ textAlign: 'left' }} onClick={() => { handleTab("CHATROOM") }}>
                            <ListItemIcon>
                                <Avatar alt="Alice" src="./images/chatroomIcon.png" />
                            </ListItemIcon>
                            <ListItemText variant="outlined" sx={{ width: '20vw', minWidth: '10vw' }}>Chatroom  <strong style={{ marginLeft: '15px' }}>{userRoom}</strong></ListItemText>
                        </ListItem>

                        {
                            userlist.map((name, index) => (
                                <>
                                    {index === 0 ? <ListItem button onClick={() => { handleTab(name) }} style={{ color: 'grey' }}>
                                        <ListItemIcon>
                                            <Avatar alt="Alice" src="./images/admin.png" />
                                        </ListItemIcon>
                                        <ListItemText variant="outlined" key={index} sx={{ width: '20vw', minWidth: '10vw' }} id={index}>{name}</ListItemText>
                                    </ListItem>
                                        :
                                        <ListItem button onClick={() => { handleTab(name) }}>
                                            <ListItemIcon>
                                                <Avatar alt="Alice" src={currentUser == name ? "./images/currentUserIcon.png" : "./images/chatusericon.png"} />
                                            </ListItemIcon>
                                            <ListItemText variant="outlined" key={index} sx={{ width: '20vw', minWidth: '10vw' }} bgcolor={currentUser == name ? 'blue' : 'black'} id={index}>{name}</ListItemText>
                                        </ListItem>}
                                </>
                            ))
                        }
                    </List>
                </Grid>
                {tab === "CHATROOM" ?
                    <Grid item xs={7} md={10} id="chatroomTab">
                        <ChatContainer>
                            <MessageArea>
                                {publicChats.map((message) => (
                                    <MessageBubble key={message.id} sent={currentUser == message.sendername}>
                                        {/* <Avatar
                                            src={`https://${message.avatar}`}
                                            alt={message.sent ? "User Avatar" : "Contact Avatar"}
                                            sx={{ width: 36, height: 36 }}
                                        /> */}
                                        <Box>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: "block",
                                                    mt: 0.5,
                                                    color: "rgba(0, 0, 0, 0.6)",
                                                    marginLeft: currentUser == message.sendername ? "100px":""
                                                }}
                                            >
                                            { currentUser == message.sendername ? "You" : message.sendername}
                                            </Typography>
                                            <Message sent={currentUser == message.sendername}>
                                                <Typography variant="body1">{message.message}</Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        display: "block",
                                                        mt: 0.5,
                                                        color: currentUser == message.sendername ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)"
                                                    }}
                                                >
                                                    {message.timestamp}
                                                </Typography>
                                            </Message>
                                        </Box>
                                    </MessageBubble>
                                ))}
                                {/* {isTyping && (
                                    <TypingIndicator>
                                        <Typography variant="body2">Typing...</Typography>
                                    </TypingIndicator>
                                )} */}
                                {/* <div ref={messageEndRef} /> */}
                            </MessageArea>
                            <InputArea>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Type your message..."
                                    value={msg}
                                    onChange={handleMessage}
                                    onKeyPress={(e) => e.key === "Enter" && sendPublicMessage()}
                                    size="small"
                                />
                                <IconButton
                                    onClick={sendPublicMessage}
                                    color="primary"
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        color: "#fff",
                                        "&:hover": { backgroundColor: "#1565c0" }
                                    }}
                                >
                                    <SendIcon />
                                </IconButton>
                            </InputArea>
                        </ChatContainer>
                    </Grid>
                    :
                    <Grid item xs={7} md={10} id="privateRoomTab">
                        <ChatContainer>
                            <MessageArea>
                                {privateChats.get(tab).map(function (msg, index) {
                                    return (
                                        <MessageBubble key={index} sent={currentUser == msg.sendername}>
                                            {/* <Avatar
                                        src={`https://${message.avatar}`}
                                        alt={message.sent ? "User Avatar" : "Contact Avatar"}
                                        sx={{ width: 36, height: 36 }}
                                         /> */}
                                            <Box>
                                                <Message sent={currentUser == msg.sendername}>
                                                    <Typography variant="body1">{msg.message}</Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            display: "block",
                                                            mt: 0.5,
                                                            color: currentUser == msg.sendername ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)"
                                                        }}
                                                    >
                                                        {msg.timestamp}
                                                    </Typography>
                                                </Message>
                                            </Box>
                                        </MessageBubble>
                                    )
                                })}

                            </MessageArea>
                            <InputArea>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Type your message..."
                                    value={msg}
                                    onChange={handleMessage}
                                    onKeyPress={(e) => e.key === "Enter" && sendPrivateMesage()}
                                    size="small"
                                />
                                <IconButton
                                    onClick={sendPrivateMesage}
                                    color="primary"
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        color: "#fff",
                                        "&:hover": { backgroundColor: "#1565c0" }
                                    }}
                                >
                                    <SendIcon />
                                </IconButton>
                            </InputArea>
                        </ChatContainer>
                    </Grid>
                }
            </Grid>
        </div >
    );
}

export default ChatWindow;
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

const ChatWindow1 = ({ userlist, privateChats, handleMessage, sendPublicMessage, publicChats, tab, handleTab, sendPrivateMesage, msg, userRoom }) => {
    const classes = useStyles();
    useEffect(() => {

    }, [privateChats]);


    useEffect(() => {

    }, [publicChats]);
    useEffect(() => {
        console.log("Tab : ", tab);
    }, [tab]);
    console.log("Userlist in chatWindow : ", userlist);

    return (
        <div>

            <Grid container component={Paper} className={classes.chatSection} style={{ height: '100%' }}>
                <Grid item xs={5} className={classes.borderRight500}>
                    <Divider />
                    <List>
                        <ListItem button id="chatroomButton" alignItems='center' sx={{ textAlign: 'left' }} onClick={() => { handleTab("CHATROOM") }}>
                            <ListItemIcon>
                                <Avatar alt="Alice" src="./images/chatroomIcon.png" />
                            </ListItemIcon>
                            <ListItemText variant="outlined" sx={{ width: '20vw', minWidth: '10vw' }}>Chatroom</ListItemText>
                        </ListItem>

                        {
                            userlist.map((name, index) => (
                                <>
                                    <ListItem button onClick={() => { handleTab(name) }}>
                                        <ListItemIcon>
                                            <Avatar alt="Alice" src="./images/chatusericon.png" />
                                        </ListItemIcon>
                                        <ListItemText variant="outlined" key={index} sx={{ width: '20vw', minWidth: '10vw' }} >{name}</ListItemText>
                                    </ListItem>
                                </>
                            ))
                        }
                    </List>
                </Grid>
                {tab === "CHATROOM" ?
                    <Grid item xs={7} id="chatroomTab">
                        <List className={classes.messageArea}>
                            <ListItem key="1">
                                <Grid container>
                                    <Grid item xs={12}>
                                        <ul>
                                            {publicChats.map(function (data, index) {
                                                return (
                                                    <ListItemText key={index} align="right">{data.sendername}:  {data.message}</ListItemText>
                                                )
                                            })}
                                        </ul>

                                    </Grid>
                                    <Grid item xs={12}>
                                        <ListItemText align="right" secondary="09:30"></ListItemText>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                        <Divider />
                        <Grid container style={{ padding: '20px' }}>
                            <Grid item xs={11}>
                                <TextField id="outlined-basic-email" label="Type Something" onChange={handleMessage}
                                    value={msg} fullWidth />
                            </Grid>
                            <Grid xs={1} align="right">
                                <Fab color="primary" aria-label="add" onClick={sendPublicMessage}><SendIcon /></Fab>
                            </Grid>
                        </Grid>

                    </Grid> : <Grid item xs={7} spacing={2}>
                        <List className={classes.messageArea}>
                            <ListItem key="1">
                                <Grid container>
                                    <Grid item xs={12}>
                                        <ul>
                                            {privateChats.get(tab).map(function (data, index) {
                                                return (
                                                    <ListItemText key={index} align="right">{data.sendername}:  {data.message}</ListItemText>
                                                )
                                            })}
                                        </ul>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ListItemText align="right" secondary="09:30"></ListItemText>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                        <Divider />
                        <Grid container style={{ padding: '20px' }}>
                            <Grid item xs={11}>
                                <TextField id="outlined-basic-email" label="Type Something" onChange={handleMessage}
                                    value={msg} fullWidth />
                            </Grid>
                            <Grid xs={1} align="right">
                                <Fab color="primary" aria-label="add" onClick={sendPrivateMesage}><SendIcon /></Fab>
                            </Grid>
                        </Grid>
                    </Grid>}
            </Grid>
        </div>
    );
}

export default ChatWindow1;
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import AppIcon from '../images/chat-icon.png';
import '../index.css';
import dateFormat, { masks } from "dateformat";
import Carousel from './Carousel';

function Header() {
    var [date, setDate] = useState(new Date());
    useEffect(() => {
        var timer = setInterval(() => setDate(new Date()), 60000)
        return function cleanup() {
            clearInterval(timer)
        }

    });

    return (
        <Grid container spacing={10}>
            <Grid item xs={6} md={4} maxWidth={'100rem'}>
                <Box sx={{
                    textAlign: 'left'
                }}>
                    <img src={AppIcon} alt="app icon" width="80" height="80"></img>
                    <strong>Connect</strong>
                </Box>
            </Grid>
            <Grid item xs={6} md={8} maxWidth={'100rem'}>
                <Box padding={2} sx={{
                    textAlign: 'right',
                }}>
                    <strong className='date'>{dateFormat(date, "ddd, mmm dS, yyyy, h:MM TT")}</strong>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Header

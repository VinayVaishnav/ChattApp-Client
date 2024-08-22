import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box style={{backgroundColor:"#cacaca"}} height={"100%"}>
        <Typography p={"2rem"} mr={"1rem"} variant='h5' textAlign={"center"}>Select a Friend to Chat </Typography>
    </Box>
  )
}

export default AppLayout()(Home);

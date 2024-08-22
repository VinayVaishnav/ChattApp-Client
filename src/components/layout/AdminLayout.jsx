import { Close, Menu,Dashboard, ManageAccounts, Groups, Message, ExitToApp } from '@mui/icons-material'
import { Box, Drawer, Grid, IconButton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation,Link, Navigate } from 'react-router-dom'
import { adminLogout } from '../../redux/thunks/admin'


const Sidebar=({w="100%"})=>{

    const dispatch=useDispatch();

    const location =useLocation();
    const adminTabs=[
        {
            name:"Dashboard",
            path:"/admin/dashboard",
            icon: <Dashboard/>,
        },
        // {
        //     name:"Users",
        //     path:"/admin/users",
        //     icon: <ManageAccounts/>,
        // },
        // {
        //     name:"Chats",
        //     path:"/admin/chats",
        //     icon: <Groups/>,
        // },
        // {
        //     name:"Messages",
        //     path:"/admin/messages",
        //     icon: <Message/>,
        // },
    ];

    const logOutHandler=()=>{
        dispatch(adminLogout());
    };

    return (
        <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
            <Typography variant='h3' textTransform={"uppercase"}>Chatty</Typography>
        
            <Stack spacing={"1rem"}>
                {
                    adminTabs.map((tab)=>{
                        const isActive = location.pathname === tab.path;
                        console.log(tab.name);
                        return (
                            <Link 
                                key={tab.path} 
                                to={tab.path} 
                                style={{ 
                                    textDecoration: 'none', 
                                    color: isActive ? 'white' : 'inherit', 
                                    backgroundColor: isActive ? 'black' : 'transparent',
                                    padding: isActive ? '0.5rem' : '0', // Optional: Adding some padding to highlight the active link
                                    borderRadius: isActive ? '0.25rem' : '0' // Optional: Adding border-radius for better look
                                }}
                            >
                                <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                                    {tab.icon}
                                    <Typography>{tab.name}</Typography>
                                </Stack>
                            </Link>
                        );
                    })
                }
                <Link onClick={logOutHandler} style={{color:"black"}}>
                    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                        <ExitToApp />
                        <Typography>Logout</Typography>
                    </Stack>
                </Link>
            </Stack>
        </Stack>

    )
}

const AdminLayout = ({children}) => {
    const {isAdmin}=useSelector((state)=>state.auth);
    const [isMobile,setIsMobile]=useState(false);
    const handleMobile =()=>setIsMobile(!isMobile);
    const handleClose=()=>setIsMobile(false);
    if(!isAdmin) return <Navigate to="/admin"></Navigate>

  return (
    <Grid container minHeight={"100vh"}>
        <Box
            sx={{
                display:{xs:"block", md:"none"},
                position:"fixed",
                right:"1rem",
                top:"1rem",
            }}
        >
            <IconButton onClick={handleMobile}>
                {
                    isMobile ? <Close/> : <Menu/>
                }
            </IconButton>
        </Box>
        <Grid 
            item
            md={4}
            lg={3}
            sx={{display:{xs:"none",md:"block"}}}
        >
            <Sidebar/>
        </Grid>

        <Grid
            item
            xs={12}
            md={8}
            lg={9}
            sx={{
                bgcolor:"#f5f5f5",
            }}
        >
            {children}
        </Grid>
            <Drawer open={isMobile} onClose={handleClose}>
                <Sidebar w="50vw"/>
            </Drawer>
    </Grid>
  )
}

export default AdminLayout

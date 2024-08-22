import { Add, Group, Logout, Menu, Notifications, Search } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { orange } from '@mui/material/colors';
import axios from 'axios';
import React, { Suspense, lazy, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userNotExists } from '../../redux/reducers/auth.js';
import { setIsMobile, setIsNewGroup, setIsNotifications, setIsSearch } from '../../redux/reducers/misc.js';
import { resetNotificationCount } from "../../redux/reducers/chat.js";
import { server } from "../../constants/config.js";

const SearchDialog= lazy(()=>import("../specific/Search"))
const NotificationDialog= lazy(()=>import("../specific/Notifications"))
const NewGroupDialog= lazy(()=>import("../specific/NewGroup"))

const Header = () => {
    const dispatch=useDispatch();

    const { notificationCount } = useSelector((state) => state.chat);
    const {isSearch,isNotifications, isNewGroup}=useSelector((state)=>state.misc);

    const handleMobile=()=>{
        dispatch(setIsMobile(true));
    }
    const openSearch=()=>{
        dispatch(setIsSearch(true));
    }
    const openNewGroup=()=>{
        // console.log("new groo")
        dispatch(setIsNewGroup(true));
        // console.log(isNewGroup);
    }

    const openNotification=()=>{ 
        dispatch(setIsNotifications(true));
        dispatch(resetNotificationCount());
    }

    const navigate = useNavigate();
    const navigateToGroup = () => {
        // console.log("called groups");
        navigate("/groups");
    };
    const logoutHandler=async()=>{
        console.log("Logout");
        try{
            const {data}=await axios.get(`${server}/api/v1/user/logout",{withCredentials:true}`);
            dispatch(userNotExists());
            toast.success(data.message);
        } catch(error){
            toast.error(error.response.data.message||"Something went wrong");
        }
    }

  return (
    <>
        <Box>
            <AppBar position="static" sx={{ bgcolor: orange[500] }}>
                <Toolbar>
                    <Typography
                        variant='h6'
                        sx={{display:{xs:"none",sm:"block"}}}
                    > Chatty
                    </Typography>
                    <Box variant='h6'
                        sx={{display:{xs:"block",sm:"none"}}}>
                            <IconButton color="inherit" onClick={handleMobile}>
                                <Menu></Menu>
                            </IconButton>
                    </Box>
                    <Box sx={{flexGrow:1}}></Box>
                    <Box>

                        <IconBtn title={"Search"} icon={<Search/>} onclick={openSearch} />
                        <IconBtn title={"New Group"} icon={<Add/>} onclick={openNewGroup} />
                        <IconBtn title={"Manage Group"} icon={<Group/>} onclick={navigateToGroup} />
                        <IconBtn title={"Notifications"} icon={<Notifications/>} onclick={openNotification} value={notificationCount}/>
                        <IconBtn title={"Logout"} icon={<Logout/>} onclick={logoutHandler} />
                        
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>

        {
            isSearch &&(
                <Suspense fallback={<div>Loading...</div>}>
                    <SearchDialog/>
                </Suspense>
            )
        }

        {
            isNotifications &&(
                <Suspense fallback={<div>Loading...</div>}>
                    <NotificationDialog/>
                </Suspense>
            )
        }

        {
            isNewGroup &&(
                
                <Suspense fallback={<div>Loading...</div>}>
                    <NewGroupDialog/>
                </Suspense>
            )
        }
    </>
  )
}

const IconBtn = ({ title, icon, onclick, value }) => {
    // console.log(value);
    return (
      <Tooltip title={title}>
        <IconButton color="inherit" size="large" onClick={onclick}>
          {value ? (
            <Badge badgeContent={value} color="error">
              {icon}
            </Badge>
          ) : (
            icon
          )}
        </IconButton>
      </Tooltip>
    );
  };

export default Header;

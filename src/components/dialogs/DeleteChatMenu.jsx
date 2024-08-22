import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { setIsDeleteMenu } from '../../redux/reducers/misc';
import { Delete, ExitToApp } from '@mui/icons-material';
import { useAsyncMutation } from '../../hooks/hook';
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api';
import { useNavigate } from 'react-router-dom';

const DeleteChatMenu = ({dispatch,deleteMenuAnchor}) => {
    const navigate=useNavigate();
    const {isDeleteMenu,selectedDeleteChat}=useSelector((state)=>state.misc);
    const isGroup = selectedDeleteChat.groupChat;

    const [deleteChat, _, deleteChatData] = useAsyncMutation(
        useDeleteChatMutation
    );

    const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
        useLeaveGroupMutation
    );

    const closeHandler=()=>{
        dispatch(setIsDeleteMenu(false));
    };

    const leaveGroupHandler = () => {
        closeHandler();
        leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
        navigate("/");
    };

    const deleteChatHandler = () => {
        closeHandler();
        deleteChat("Deleting Chat...", selectedDeleteChat.chatId);
        navigate("/");
    };

    useEffect(() => {
        if (deleteChatData || leaveGroupData) navigate("/");
    }, [deleteChatData, leaveGroupData]);
    
    return (
    <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteMenuAnchor.current}
        anchorOrigin={{vertical:"bottom",horizontal:"right"}}
        transformOrigin={{
            vertical:"center",
            horizontal:"center",
        }}
    >
        <Stack
        sx={{
          width: "10rem",
          padding: "0.5rem",
          cursor: "pointer",
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
      >
        {isGroup ? (
          <>
            <ExitToApp />
            <Typography>Leave Group</Typography>
          </>
        ) : (
          <>
            <Delete />
            <Typography>Delete Chat</Typography>
          </>
        )}
      </Stack>
    </Menu>
  )
}

export default DeleteChatMenu

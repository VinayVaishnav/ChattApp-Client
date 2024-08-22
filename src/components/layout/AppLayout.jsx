import React, { useCallback, useEffect, useRef } from 'react';
import Header from './Header';
// import { Title } from '../shared/Title';
import { Drawer, Grid, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate as navigate, useParams } from 'react-router-dom';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from '../../constants/events.js';
import { useErrors, useSocketEvents } from '../../hooks/hook.jsx';
import { useMyChatsQuery } from '../../redux/api/api';
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat.js';
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/reducers/misc.js';
import { getSocket } from '../../socket.jsx';
import ChatList from '../specific/ChatList';
import Profile from '../specific/Profile';
import { getOrSaveFromStorage } from '../../lib/features.js';
import DeleteChatMenu from '../dialogs/DeleteChatMenu.jsx';


const AppLayout = () => (WrappedComponent)=> {
  return (props)=>{
    const params=useParams();
    const dispatch=useDispatch();
    const chatId=params.chatId;
    const deleteMenuAnchor=useRef(null);
    const socket=getSocket();
    // console.log(socket.id);

    const {isMobile}= useSelector((state)=>state.misc);
    const {user}= useSelector((state)=>state.auth);
    const {newMessagesAlert}=useSelector((state)=>state.chat);

    const {isLoading,data,isError,error,refetch}=useMyChatsQuery("");
    // console.log(data);
    
    useErrors([{isError,error}]);

    useEffect(()=>{
        getOrSaveFromStorage({key:NEW_MESSAGE_ALERT, value:newMessagesAlert});
    },[newMessagesAlert])

    const handleDeleteChat=(e,_id,groupChat)=>{
        dispatch(setIsDeleteMenu(true));
        dispatch(setSelectedDeleteChat({chatId,_id,groupChat}));
        deleteMenuAnchor.current=e.currentTarget;
        // console.log("Delect Chat",_id,groupChat);
    }

    const handleMobileClose=()=>{
        dispatch(setIsMobile(false));
    }

    const newMessageAlertListener = useCallback(
        (data) => {
            console.log("new msg alert")
            if (data.chatId === chatId) return;
            dispatch(setNewMessagesAlert(data));
        },
        [chatId]
    );

    const newRequestListener = useCallback(() => {
        // console.log("new req called");
        dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
        refetch();
        navigate("/");
    }, [refetch, navigate]);

    // const onlineUsersListener = useCallback((data) => {
    //     setOnlineUsers(data);
    // }, []);

    const eventHandlers = {
        [NEW_MESSAGE_ALERT]: newMessageAlertListener,
        [NEW_REQUEST]: newRequestListener,
        [REFETCH_CHATS]: refetchListener,
        // [ONLINE_USERS]: onlineUsersListener,
    };
    useSocketEvents(socket,eventHandlers);
    return(
        <>
            {/* <Title/> */}
            <Header />
            <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />

            {
                isLoading?<Skeleton/>:(
                    <Drawer open={isMobile} onClose={handleMobileClose}>
                        <ChatList 
                            w="70vw"
                            chats={data?.chats} 
                            chatId={chatId}
                            handleDeleteChat={handleDeleteChat}
                            newMessagesAlert={newMessagesAlert}
                        />
                    </Drawer>
                )
            }

            <Grid container height={"calc(100vh - 4rem)"}>
                <Grid item sm={4} md={3} 
                    sx={{ display: { xs: "none", sm: "block" } }} height={"100%"}>
                        {
                            isLoading?(<Skeleton/>): <ChatList 
                                        chats={data?.chats} 
                                        chatId={chatId}
                                        handleDeleteChat={handleDeleteChat}
                                        newMessagesAlert={newMessagesAlert}
                                    />
                        }
                </Grid>

                <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"} >
                    <WrappedComponent {...props} chatId={chatId} user={user}/>
                </Grid>

                <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" }, padding:'2rem',bgcolor:"rgb(0,0,0,0.85)" }} height={"100%"}><Profile user={user}/></Grid>
            </Grid>
            
        </>

    )
  }
}

export default AppLayout;

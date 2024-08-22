import React, { useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material';
import { AttachFile, Chair, Send } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import { sampleMessage } from '../components/constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../socket';
import { NEW_MESSAGE } from '../constants/events.js';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api.js';
import { useErrors, useSocketEvents } from '../hooks/hook.jsx';
import { useInfiniteScrollTop } from '6pp';
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc.js';
import { FileMenu } from '../components/dialogs/FileMenu.jsx';


const Chat = ({chatId,user}) => {
  const dispatch=useDispatch();
  const containerRef=useRef(null);
  const socket=getSocket();
  const bottomRef=useRef(null);
  
  const [message,setMessage]=useState("");
  const [messages,setMessages]=useState([]);
  const [page,setPage]=useState(1);
  const [fileMenuAnchor,setFileMenuAnchor]=useState(null);

  const chatDetails= useChatDetailsQuery({chatId,skip: !chatId});  
  const oldMessagesChunk=useGetMessagesQuery({chatId,page});

  const {data:oldMessages,setData: setOldMessages}=useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  // console.log(oldMessagesChunk.data);

  const err=[
    {isError:chatDetails.isError,error: chatDetails.error},
    {isError:oldMessagesChunk.isError, error: oldMessagesChunk.error}
  
  ];

  const handleFileOpen=(e)=>{
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  }
  
  const submitHandler=(e)=>{
    // console.log(message);
    e.preventDefault();

    if(!message.trim()) return;
    const members=chatDetails?.data?.chat?.members;
    console.log(members);

    socket.emit(NEW_MESSAGE,{chatId,members,message});
    setMessage("");
  };

  useEffect(()=>{


    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      // socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  },[chatId])

  useEffect(()=>{
    if(bottomRef.current) bottomRef.current.scrollIntoView({behavior:"smooth"});
  },[messages]);


  const newMsgHandler=useCallback((data)=>{
    console.log(data.chatId);
    console.log(chatId)

    if(data.chatId!==chatId) return;
    // console.log(data);
    setMessages((prev)=>[...prev,data.message]);
  },[chatId]);


  const eventArr={[NEW_MESSAGE]:newMsgHandler};

  useSocketEvents(socket,eventArr);
  useErrors(err);

  const allMessages=[...oldMessages,...messages]
  // const containerRef=useRef(null);

  return chatDetails.isLoading?<Skeleton/>:(
    <>
    <Stack 
      ref={containerRef}
      boxSizing={"border-box"}
      padding={"1rem"}
      spacing={"1rem"}
      bgcolor={"#cacaca"}
      height={"90%"}
      sx={{
        overflowX:"hidden",
        overflowY:"auto",
      }} 
    >
      {allMessages.map((i)=> (
        <MessageComponent message={i} user={user} key={i._id}/>
      ))}
      <div ref={bottomRef}/>
    </Stack>

      <form style={{
        height:"10%",
      }}
      onSubmit={submitHandler}
      >
        <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"}>
          <IconButton
            sx={{
              position:"absolute",
              left:"1.5rem",
              rotate:"30deg",
            }}
            onClick={handleFileOpen}
          >
            <AttachFile/>
          </IconButton>

          <InputBox placeholder='Type Message here...' value={message} onChange={(e)=>setMessage(e.target.value)}/>
          <IconButton type='submit' sx={{
              backgroundColor:"orange",
              color:"white",
              marginLeft:"0.5rem",
              "&:hover":{
                bgcolor:"primary.dark",
              }
            }}>
            <Send/>
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}/>
    </>  
  )
}

export default AppLayout()(Chat);

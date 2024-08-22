import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import React from 'react';
import { sampleNotifications } from '../constants/sampleData';
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api';
import { useErrors } from '../../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotifications } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';

const Notifications = () => {
  const {isNotifications}=useSelector((state)=>state.misc);
  const dispatch=useDispatch();
  const {isLoading,data,error,isError}=useGetNotificationsQuery();

  const [acceptReq]=useAcceptFriendRequestMutation();
  const friendRequestHandler= async({_id,accept})=>{
    try{
      const res=await acceptReq({requestId:_id,accept});
      if(res.data?.success){
        toast.success(res.data.message);
      } else toast.error(res?.data?.error || "Something went wrong");
    } catch(err){
      toast.error("Something went wrong")
      console.log(err);
    }
  };

  useErrors([{error,isError}]);

  const closeHandler=()=>dispatch(setIsNotifications(false));

  return (
    // <div>hi</div>
    <Dialog open={isNotifications} onClose={closeHandler}>
      <Stack p={{xs:"1rem" ,sm:"2rem"}} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        
          {
            isLoading?<Skeleton/>:
            (
              <>
                {
                data?.allRequests?.length > 0? (
                  
                  data.allRequests?.map( (i) => (
                    // <div>{i.sender.name}</div>
                    <NotificationItem sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id} />
                  ))
                  
                  ) : 
                  (
                    <>
                      <Typography textAlign={"center"}>No Notifications</Typography>
                    </>
                  )
                }
              </>
            )
          }


      </Stack>
    </Dialog> 
  )
};

const NotificationItem= ({sender,_id,handler}) =>{
  const {avatar,name}=sender;
  return (
    <ListItem>
            <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={"1rem"}
                width={"100%"}
            >
                <Avatar/>
                <Typography
                    sx={{
                        flexGrow:1,
                        // display:"-webkit-box",
                        // WebkitLineClamp:1,
                        // WebkitBoxOrient:"vertical",
                        overflow:"hidden",
                        textOverflow:"ellipsis",
                    }}
                >{`${name} send you a friend request`}
                </Typography>
                <Stack direction={{
                  xs:"column",
                  sm:"row",
                }}>
                  <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
                  <Button color="error" onClick={()=> handler({_id,accept:false})}>Reject</Button>
                </Stack>
            </Stack>
        </ListItem>
  );
};

export default (Notifications)

import { Add, Delete, Done, Edit, Group, KeyboardBackspace, Menu } from '@mui/icons-material';
import { Backdrop, Box, Button, ButtonGroup, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import React, { Suspense, useEffect, useState,lazy } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AvatarCard from '../components/shared/AvatarCard';
import { sampleChats, sampleUsers } from '../components/constants/sampleData';
import AddMemberDialoge from '../components/dialogs/AddMemberDialog';
import UserItem from '../components/shared/UserItem';
import { useAddGroupMembersMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../redux/reducers/misc';

const Groups = () => {

  const dispatch=useDispatch();

  const {isAddMember} = useSelector((state)=>state.misc);

  const chatId = useSearchParams()[0].get("group");

  const ConfirmDeleteDialog=lazy(()=>import("../components/dialogs/ConfirmDeleteDialog"))
  const AddMemberDialog=lazy(()=>import("../components/dialogs/AddMemberDialog"))

  const myGroups=useMyGroupsQuery("");
  const groupDetails=useChatDetailsQuery({chatId,populate:true},{skip: !chatId});

  const [updateGroup,isLoadingGroupName]= useAsyncMutation(useRenameGroupMutation)

  const [removeMember,isLoadingRemoveMember]= useAsyncMutation(useRemoveGroupMemberMutation)

  const [deleteGroup,isDeleteGroup]= useAsyncMutation(useDeleteChatMutation)

  const [groupName,setGroupName]=useState("");
  const [groupNameUpdatedValue,setGroupNameUpdatedValue]=useState("");

  const [members, setMembers] = useState([]);
  const errors=[{
    isError: myGroups.isError,
    error:myGroups.error
  }]

  useErrors(errors);

  useEffect(()=>{
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const navigate=useNavigate();

  const navigateBack=()=>{
    navigate("/");
  };

  const [isMobileMenuOpen,setIsMobileMenuOpen]=useState(false);
  const [isEdit,setIsEdit]=useState(false);

  const handleMobile=()=>{
    setIsMobileMenuOpen((prev)=>!prev);
  };

  const handleMobileClose=()=>setIsMobileMenuOpen(false);
  const updateGroupName=()=>{
    setIsEdit(false);
    updateGroup("Updating Group Name ...",{chatId,name:groupNameUpdatedValue});
    // console.log(groupNameUpdatedValue);
  }

  const IconBtns=(
  <>
      <Box 
        sx={{
          display: {
            xs: "flex",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <Menu />
        </IconButton>
      </Box>

      <Tooltip title="back">
          <IconButton
              sx={{
                  position: "absolute",
                  top: "2rem",
                  left: "2rem",
                  bgcolor: "rgba(0,0,0,1)",
                  color: 'white',
                  ":hover": {
                    bgcolor: "rgba(0,0,0,0.2)",
                  },
              }}
              onClick={navigateBack}
          >
              <KeyboardBackspace />
          </IconButton>
      </Tooltip>
    
  </>
  );


  const GroupName=(<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem"}>
    {
      isEdit ? <>
            <TextField value={groupNameUpdatedValue} onChange={(e)=>setGroupNameUpdatedValue(e.target.value)}/>
            <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
              <Done/>
            </IconButton>
      </>
            :  <>
                <Typography variant='h4' >{groupName}</Typography>
                <IconButton onClick={()=> setIsEdit(true)} disabled={isLoadingGroupName}>
                  <Edit/></IconButton>
              </>
    }
  </Stack>);

  const [confirmDeleteDialog, setConfirmDeleteDialog]=useState(false);

  const openAddMemberHandler=()=>{
    dispatch(setIsAddMember(true));
  }

  const openConfirmDeleteHandler=()=>{
    setConfirmDeleteDialog(true);
  }
  const closeConfirmDeleteHandler=()=>{
    setConfirmDeleteDialog(false);
  }

  const deleteHandler=()=>{
    deleteGroup("Deleting Group...",chatId),
    closeConfirmDeleteHandler();
    navigate("/groups");
  }

  const ButtonGroup=(
    <Stack
      direction={{
        xs:"column-reverse",
        sm:"row",
      }}
      spacing={"1rem"}
      p={{
        xs:"0",
        sm:"1rem",
        md:"1rem 4rem",
      }}
    >
      <Button color='error' size='large' onClick={openConfirmDeleteHandler} startIcon={<Delete/>}>Delete Group</Button>
      <Button size='large' variant='contained' onClick={openAddMemberHandler} startIcon={<Add/>}>Add Member</Button>
    </Stack>
  );

  const removeMemberHandler=(userId)=>{
    // console.log("removing");
    removeMember("Removing member",{chatId,userId});
  };

  return myGroups.isLoading?<></>:(
    <Grid container height={"100vh"}  >
      <Grid
        item
        sx={{
          display:{
            xs:"none",
            sm:"block",
          },
        }}
        sm={4}
        bgcolor={"orange"}
        >
          <GroupList myGroups={myGroups?.data?.groups} chatId={chatId}/>
        </Grid>

        <Grid 
          item
          xs={12}
          sm={8}
          sx={{
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            position:"relative",
            padding:"1rem 3rem"
          }}
        >
          {IconBtns}
          {groupName && 
            <>
              {GroupName}
              <Typography
                  margin={"2rem"}
                  alignSelf={"flex-start"}
                  variant='h5'
                >
                  Members :
              </Typography>
              <Stack
                maxWidth={"45rem"}
                width={"100%"}
                boxSizing={"border-box"}
                padding={{
                  sm:"1rem",
                  xs:"0",
                  md: "1rem 4rem",
                }}
                spacing={"2rem"}
                bgcolor={""}
                height={"50vh"}
                overflow={"auto"}
                marginBottom={"10px"}
              >
                {/* {member} */}
                { isLoadingRemoveMember? <CircularProgress/>:
                  members.map((i)=>(
                    <UserItem user={i} isAdded styling={{
                      boxShadow:"0 0 0.5rem rgba(0,0,0,0.2)",
                      padding:"1rem 2rem",
                      borderRadius: "1rem",
                    }}
                    handler={removeMemberHandler}
                    key={i._id}
                    />
                  ))
                }
              </Stack>
              {ButtonGroup}
            </>}
        </Grid>

        {
          isAddMember && 
            (
              <Suspense fallback={<Backdrop open/>}>
                    <AddMemberDialoge chatId={chatId} />
              </Suspense>
            )
        }
        
        {confirmDeleteDialog && 
          (
          <Suspense fallback={<Backdrop open/>}>
              <ConfirmDeleteDialog 
                open={confirmDeleteDialog} 
                handleClose={closeConfirmDeleteHandler}
                deletehandler={deleteHandler}
              />
          </Suspense>
          )
        }

        <Drawer open={isMobileMenuOpen} onClose={handleMobileClose} 
            sx={{
              display: {
                xs: "block",
                sm: "none",
              },
            }}
          >
            <GroupList
              w={"50vw"}
              myGroups={myGroups?.data?.groups}
              chatId={chatId}
            />
        </Drawer>
    </Grid>
  )
}

const GroupList=({w="100%",myGroups=[],chatId})=>(
  <Stack width={w} sx={{height: "100vh",overflow: "auto"}}>
    {
      myGroups.length>0 ? (
        myGroups.map((group)=>
        <GroupListItem group={group} chatId={chatId} key={group._id}/>) 
          )
          : 
          <Typography textAlign={"center"} padding={"1rem"}>No Groups</Typography>
    }
  </Stack>
);

const GroupListItem=({group,chatId})=>{
  const {name,avatar,_id}=group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
      style={{marginBottom:"10px",marginLeft:'12px',marginTop:"8px"}}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
}

export default (Groups);

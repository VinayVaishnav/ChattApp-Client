import { useInputValidation } from '6pp';
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import React, { memo, useState } from 'react';
import UserItem from '../shared/UserItem';
import { useDispatch, useSelector } from 'react-redux';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { setIsNewGroup } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';

const NewGroup = () => {

  const {isNewGroup}=useSelector((state)=>state.misc);
  const dispatch=useDispatch();

  const {isError,isLoading,error,data}=useAvailableFriendsQuery("");

  const [newGroup,isloadingNewGroup]=useAsyncMutation(useNewGroupMutation);

  const groupName=useInputValidation("");
  const [selectedMembers,setSelectedMembers]=useState([]);

  const closeNewGroup=()=>{
    console.log("calling close");
    dispatch(setIsNewGroup(false));
  }
  
  const submitHandler=()=>{
    if(!groupName.value) return toast.error("Group name is required");
    if(selectedMembers.length<2) return toast.error("There should be atleast 3 members in group");

    newGroup("Creating New Group...",{name:groupName.value,members:selectedMembers});

    closeHandlerNewGroup();
  };
  const selectMemberHandler=(id)=>{
    setSelectedMembers((prev)=> (prev.includes(id) ? prev.filter((currElement)=>currElement !==id) : [...prev,id]))
  };

  const errors=[{
    isError,
    error
  }]

  useErrors(errors);

  return (
    // <div>hi</div>
    <Dialog open={isNewGroup} onClose={closeNewGroup}>
      <Stack p={{xs:"1rem" ,sm:"3rem"}} width={"25rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>
        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler}/>
        <Typography variant='body1'>Members</Typography>
        <Stack>
          {isLoading?<></> : data.friends?.map((i)=>(
            <UserItem
              user={i}
              key={i._id}
              handler={selectMemberHandler}
              isAdded={selectedMembers.includes(i._id)}
            />
          ))}
        </Stack>
        <Stack direction={"row"} justifyContent={'space-evenly'}>
          <Button variant='text' color="error" onClick={closeNewGroup}>Cancel</Button>
          <Button variant='contained' onClick={submitHandler} >Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
};

export default (NewGroup)

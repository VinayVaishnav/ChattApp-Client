import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { sampleUsers } from '../constants/sampleData'
import UserItem from '../shared/UserItem'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../../redux/reducers/misc'

const AddMemberDialoge = ({chatId}) => {
  const dispatch=useDispatch();
  const {isAddMember} = useSelector((state)=>state.misc);

  const {isLoading,data,isError,error}=useAvailableFriendsQuery(chatId);

  const [selectedMembers,setSelectedMembers]=useState([]);
  const [addMembers,isLoadingAddMember]= useAsyncMutation(useAddGroupMembersMutation)

  const selectMemberHandler=(id)=>{
    setSelectedMembers((prev)=> (prev.includes(id) ? prev.filter((currElement)=>currElement !==id) : [...prev,id]))
  };

  const addMemberSubmitHandler=()=>{
    addMembers("Adding members...",{chatId, members:selectedMembers});
    closeHandler();
  }

  const closeHandler=()=>{
    dispatch(setIsAddMember(false));
  }

  useErrors([{isError,error}]);

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={'2rem'} width={"20rem"} spacing={"2rem"}>
        <DialogTitle>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>

          { isLoading? <></>:

            data?.friends?.length>0 ? (
              data?.friends?.map(i=>(
                <UserItem key={i.id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
              ))
            ) :
              (<Typography textAlign={"center"}>No Friends</Typography>)
          }
        </Stack>
          
          <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
            <Button onClick={closeHandler}  color='error'>Cancel</Button>
            <Button onClick={addMemberSubmitHandler} variant='contained' disabled={isLoadingAddMember}>Submit Changes</Button>
          </Stack>
          
      </Stack>
    </Dialog>
  )
}

export default AddMemberDialoge

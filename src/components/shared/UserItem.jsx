import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React from 'react'
import { Add, Remove } from '@mui/icons-material'; 
import { transformImage } from '../../lib/features';

const UserItem = ({user,handler,handlerIsLoading,isAdded=false,styling={}}) => {
    const {name,_id,avatar}=user
    // console.log(avatar)

    return (
        <ListItem>
            <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={"1rem"}
                width={"100%"}
                {...styling}
            >
                
                <Avatar src={transformImage(avatar)}/>
                <Typography
                    sx={{
                        flexGrow:1,
                        // display:"-webkit-box",
                        // WebkitLineClamp:1,
                        // WebkitBoxOrient:"vertical",
                        overflow:"hidden",
                        textOverflow:"ellipsis",
                    }}
                >{name}
                </Typography>

                <IconButton 
                    size='small'
                    sx={{
                        bgcolor: isAdded? "error.main" : "primary.main",
                        color:"white",
                        "&:hover":{
                            bgcolor: isAdded? "error.dark" : "primary.dark",
                        }


                    }}
                    onClick={()=>handler(_id)} disabled={handlerIsLoading}>
                    {
                        isAdded ? <Remove/>  : <Add/> 
                    }
                    
                </IconButton>
            </Stack>
        </ListItem>
    )
};

export default (UserItem);

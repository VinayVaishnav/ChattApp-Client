import { ListItemText, Menu, MenuItem,MenuList, Tooltip } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import { AudioFile, Image, UploadFile, VideoFile } from "@mui/icons-material";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";


const FileMenu=({anchorE1,chatId})=>{
    const dispatch=useDispatch();
    const{isFileMenu}=useSelector(state=>state.misc);
    const closeFileMenu=()=> dispatch(setIsFileMenu(false));
    
    const imageRef=useRef(null);
    const audioRef=useRef(null);
    const videoRef=useRef(null);
    const fileRef=useRef(null);

    const [sendAttachments]=useSendAttachmentsMutation();

    const selectImage=(ref)=>{
        imageRef.current?.click();
    }
    const selectAudio=(ref)=>{
        audioRef.current?.click();
    }
    const selectVideo=(ref)=>{
        videoRef.current?.click();
    }
    const selectFile=(ref)=>{
        fileRef.current?.click();
    }

    const fileChangeHandler= async(e,key)=>{
        const files=Array.from(e.target.files);

        if(files.length<=0) return;
        if(files.length>5) return ToastIcon.error(`You can send only 5 ${key} at a time.`)

        dispatch(setUploadingLoader(true));
        const toastId=toast.loading(`sending ${key}...`);
        closeFileMenu();

        try{
            const myForm=new FormData();
            myForm.append("chatId",chatId)

            files.forEach((file)=>myForm.append("files",file));

            const res=await sendAttachments(myForm)

            if(res.data) toast.success(`${key} sent successfully`,{id:toastId});
            else toast.error(`failed to send ${key}`,{id:toastId});



        } catch(err){
            toast.error(err,{id:toastId});
        }
        finally{
            dispatch(setUploadingLoader(false));
        }
    };
    
    return (
        <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu}>
            <div style={{
                width:"10rem",

            }}>

            <MenuList>
                <MenuItem onClick={selectImage} >
                <Tooltip title="Image">
                    <Image/>
                </Tooltip>
                <ListItemText style={{marginLeft:"0.5rem"}}>Image</ListItemText>
                <input 
                    type="file"
                    multiple 
                    accept="image/png,image/jpeg, image/gif" 
                    style={{display:"none"}}
                    onChange={(e)=>fileChangeHandler(e,"Images")}
                    ref={imageRef}
                />
                </MenuItem>
            
                <MenuItem onClick={selectAudio}>
                <Tooltip title="Audio">
                    <AudioFile/>
                </Tooltip>
                <ListItemText style={{marginLeft:"0.5rem"}}>Audio</ListItemText>
                <input type="file" multiple accept="audio/wav, audio/mpeg" 
                    style={{display:"none"}}
                    onChange={(e)=>fileChangeHandler(e,"Audios")}
                    ref={audioRef}
                />
                </MenuItem>
                
                <MenuItem onClick={selectVideo}>
                <Tooltip title="Video">
                    <VideoFile/>
                </Tooltip>
                <ListItemText style={{marginLeft:"0.5rem"}}>Video</ListItemText>
                <input type="file" multiple accept="video/mp4, video/webm, video/ogg" 
                    style={{display:"none"}}
                    onChange={(e)=>fileChangeHandler(e,"Videos")}
                    ref={videoRef}
                />
                </MenuItem>
           
                <MenuItem onClick={selectFile}>
                <Tooltip title="File">
                    <UploadFile/>
                </Tooltip>
                <ListItemText style={{marginLeft:"0.5rem"}}>File</ListItemText>
                <input type="file" multiple accept="*" 
                    style={{display:"none"}}
                    onChange={(e)=>fileChangeHandler(e,"files")}
                    ref={fileRef}
                />
                </MenuItem>
            </MenuList>

            </div>
        </Menu>
    );
};

export {FileMenu};
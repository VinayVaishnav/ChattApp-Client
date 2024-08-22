import { useFileHandler, useInputValidation } from "6pp"
import { CameraAlt } from "@mui/icons-material"
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import axios from "axios"
import React, { useState } from 'react'
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { VisuallyHidden } from '../components/styles/StyledComponents'
import { userExists } from "../redux/reducers/auth"
import { usernameValidator } from "../utils/validators"
import { server } from "../constants/config"

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    const [isLoading,setIsLoading]=useState(false);
    
    // Correctly toggle the state
    const toggleLogin = () => setIsLogin(prevIsLogin => !prevIsLogin);
    const name=useInputValidation("");
    const bio=useInputValidation("");
    const username=useInputValidation("",usernameValidator);
    const password=useInputValidation("");
    const avatar=useFileHandler("single");
    const dispatch=useDispatch();

    const handleLogin = async (e) => {

        e.preventDefault();
        setIsLoading(true);
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        };
        
        try {
            const { data } = await axios.post(
                `${server}/api/v1/user/login`,
                {
                    username: username.value,
                    password: password.value,
                },
                config
            );
            console.log(data);
            dispatch(userExists(data.user));
        } catch (error) {
            console.log(error);
            const errorMessage = error.response.data.message || "Something went wrong";
            toast.error(errorMessage);
        } finally{
            setIsLoading(false);
        }

    };
    const handleSignUp= async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        const formData=new FormData();
        formData.append("avatar",avatar.file);
        formData.append("name",name.value);
        formData.append("bio",bio.value);
        formData.append("username",username.value);
        formData.append("password",password.value);

        try{
            const config={
                withCredentials:true,
                headers:{
                    "Content-Type":"multipart/form-data",
                },
            }
            const {data}=await axios.post(`${server}/api/v1/user/new`,
                formData,config
            );
            dispatch(userExists(data.user));
        } catch(err){
            console.log(err);
            toast.error(err.response.data.message || "something went wrong");
        } finally{
            setIsLoading(false);
        }
    }

    return (
        <div style={{backgroundColor:"bisque"}}>
        <Container component={"main"} maxWidth="xs" sx={{
            height:"100vh",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
        }}>
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                {
                    isLogin ?
                        (
                            <>
                                <Typography variant='h5'>Login</Typography>
                                <form onSubmit={handleLogin}>
                                    <TextField required fullWidth label="Username" margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler}></TextField>
                                    <TextField required fullWidth label="Password" type='password' margin='normal' variant='outlined' value={password.value} onChange={password.changeHandler}></TextField>
                                    <Button fullWidth sx={{ marginTop: "2rem" }} variant='contained' color='primary' type='submit' disabled={isLoading}>Login</Button>
                                    <Typography textAlign={"center"} m={".5rem"}>Or</Typography>
                                    <Button fullWidth  variant='text' onClick={toggleLogin} disabled={isLoading} >
                                        Sign Up Insted
                                    </Button>
                                </form>
                            </>
                        )
                        :
                        (
                            <>
                                <Typography variant='h5'>Sign Up</Typography>
                                <form onSubmit={handleSignUp}>

                                    <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                                        <Avatar sx={{
                                            width:"10rem",
                                            height:"10rem",
                                            objectFit:"contain",
                                        }} src={avatar.preview}
                                        />
                                        <IconButton sx={{position:"absolute",bottom:"0",right:"0"}} component="label">
                                            <>
                                            <CameraAlt/>
                                            <VisuallyHidden type="file" onChange={avatar.changeHandler}/>
                                            </>
                                        </IconButton>
                                    </Stack>

                                    <TextField required fullWidth label="Name" margin='normal' variant='outlined' 
                                        value={name.value} onChange={name.changeHandler}></TextField>
                                    <TextField required fullWidth label="Bio" margin='normal' variant='outlined' 
                                        value={bio.value} onChange={bio.changeHandler}></TextField>
                                    <TextField required fullWidth label="Username" margin='normal' variant='outlined' 
                                        value={username.value} onChange={username.changeHandler} 
                                    />

                                    {username.error && (
                                        <Typography color="error" variant='caption'>
                                            {username.error}
                                        </Typography>
                                    )}
                                    <TextField required fullWidth label="Password" type='password' margin='normal' variant='outlined' 
                                        value={password.value} onChange={password.changeHandler}></TextField>
                                    <Button fullWidth sx={{ marginTop: "2rem" }} variant='contained' color='primary' type='submit' disabled={isLoading}>Sign Up</Button>
                                    <Typography textAlign={"center"} m={".5rem"}>Or</Typography>
                                    <Button fullWidth  variant='text' onClick={toggleLogin} disabled={isLoading}>
                                        Login Instead
                                    </Button>
                                </form>
                            </>
                        )
                }
            </Paper>
        </Container>
        </div>
    )
}

export default Login

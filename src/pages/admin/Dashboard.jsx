import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { AdminPanelSettings, Group, Message, Person } from '@mui/icons-material';
import { SearchField,CurveButton } from '../../components/styles/StyledComponents';
import { DoughnutChart, LineChart } from '../../components/specific/Charts';
import { useFetchData } from '6pp';
import {server} from "../../constants/config"
import {useErrors} from "../../hooks/hook"

const Dashboard = () => {

    const {loading,data,error}=useFetchData(`${server}/api/v1/admin/stats`,"dashboard-stats");

    const {stats}=data||{};
    console.log(stats);

    useErrors([{
        isError:error,
        error:error,
    }])

    const Appbar=<Paper
                        elevation={3}
                        sx={{padding:"2rem", margin:"2rem 0",borderRadius:"1rem"}}
                    >
                        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                            <AdminPanelSettings sx={{fontSize:'3rem'}}/>
                            <SearchField placeholder='Search...'/>
                            <CurveButton>Search</CurveButton>
                            <Box flexGrow={1}/>
                            <Typography>Welcome...</Typography>
                        </Stack>
                    </Paper>;

    const Widgets=
            <Stack direction={{xs:"column", sm:"row"}}
                    spacing={"2rem"}
                    justifyContent="space-between"
                    alignItems="center"
                    margin={"2rem 0"}
                    >
                <Widget title={"Users"} value={stats?.usersCount} Icon={<Person/>}/>
                <Widget title={"Chats"} value={stats?.groupsCound} Icon={<Group/>}/>
                <Widget title={"Messages"} value={stats?.messgesCount} Icon={<Message/>}/>
            </Stack>

    return loading?<>Loading...</>: (
        <AdminLayout>
            <Container component={"main"}>
                {Appbar}
                <Stack direction={{xs:"column",lg:"row"}} alignItems={{xs:"center",lg:"stretch"}} flexWrap={"wrap"} justifyContent={"center"} sx={{gap:"2rem"}}>
                    <Paper 
                        elevation={3}
                        sx={{
                            padding: "1rem 2rem",
                            borderRadius:"1rem",
                            width: {xs:"100%",sm:"50%"},
                            maxWidth:"45rem",
                            minWidth:"25rem",
                            minHeight:"17rem",
                        }}
                    >
                        <Typography padding={"0"} margin={"0.5rem"} variant='h4'> Last Message</Typography>
                        <LineChart value={stats?.messagesChart||[]}/>
                    </Paper>

                    <Paper
                        elevation={3}
                        sx={{
                            padding:'1rem',
                            borderRadius:"1rem",
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center",
                            width: {xs:"100%",sm:"50%"},
                            position:"relative",
                            width:"100%",
                            maxWidth:"25rem",
                        }}
                    >
                        <DoughnutChart labels={["Single Chat","Group Chats"]} value={[stats?.totalChatsCount-stats?.groupsCound ||0, stats?.groupsCound||0]}/>
                        <Stack
                            position={"absolute"}
                            direction={"row"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            spacing={"0.5rem"}
                            width={"100%"}
                            height={"100%"}
                            >
                            <Group/> <Typography>vsvs</Typography>
                            <Person/>
                        </Stack>
                    </Paper>
                </Stack>
                {Widgets}
            </Container>
        </AdminLayout>
    )
}

const Widget =({title,value,Icon})=>
    <Paper
        elevation={3}
        sx={{
            padding:"2rem",
            margin:"2rem 0",
            borderRadius:"1rem",
            width:"20rem",
        }}
    >
        <Stack alignItems={"center"} spacing={"1rem"}>
            <Typography
                sx={{
                    color:"rgba(0,0,0,0,7)",
                    borderRadius:"50%",
                    border:"5px solid rgba(0,0,0,0.9)",
                    width:"5rem",
                    height:"5rem",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                }}
            >{value}
            </Typography>
            
            <Stack>
                {Icon}
            </Stack>

            <Typography>
                {title}
            </Typography>

        </Stack>
    </Paper>

export default Dashboard

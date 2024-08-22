import React,{Suspense, lazy, useEffect} from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import ProtectRoute from './components/auth/ProtectRoute';
import NotFound from './pages/NotFound';
import axios from "axios";
// import { server } from './constants/config.js';
import {useDispatch, useSelector} from 'react-redux';
import { userExists, userNotExists } from './redux/reducers/auth.js';
import {Toaster} from "react-hot-toast"
import {SocketProvider} from "./socket.jsx"

const Home=lazy(()=>import("./pages/Home"));
const Login=lazy(()=>import("./pages/Login"));
const Chat=lazy(()=>import("./pages/Chat"));
const Groups=lazy(()=>import("./pages/Groups"));
const AdminLogin=lazy(()=>import("./pages/admin/AdminLogin"))
const Dashboard=lazy(()=>import("./pages/admin/Dashboard"))

const App = () => {

  const {user,loader}=useSelector((state)=>state.auth)

  const dispatch=useDispatch();
  const server="http://localhost:3000";
  useEffect(()=>{
    axios.get(`${server}/api/v1/user/me`,{withCredentials:true})
    .then(({data})=>dispatch(userExists(data.user)))
    .catch((err)=>dispatch(userNotExists()));
  },[dispatch]);

  return loader?(<></>): 
  (
    <BrowserRouter>
    
      <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<SocketProvider>
                  <ProtectRoute  user={user}/>
                </SocketProvider>}>
          <Route path='/' element={<Home/>}/>
          <Route path='groups' element={<Groups/>}/>
          <Route path='chat/:chatId' element={<Chat/>}/>
        </Route>

        <Route path='/login'
          element={<ProtectRoute  user={!user} redirect='/'>
                    <Login/>
                  </ProtectRoute>}>
        </Route>
        <Route path='/admin' element={<AdminLogin/>}/>
        <Route path='/admin/dashboard' element={<Dashboard/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      </Suspense>
      <Toaster position='bottom-center'/>
    </BrowserRouter>
  )
};

export default App

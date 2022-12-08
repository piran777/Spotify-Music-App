import React from 'react';
import ReactDOM from 'react-dom/client';
import {Route, Routes, BrowserRouter, Outlet} from 'react-router-dom';
import './index.css';
import App from './components/SecureUser/App';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Search from './components/UnauthenticatedUser/Search';
import SeePublicPlaylists from './components/UnauthenticatedUser/PublicPlaylist';
import Verify from './components/verify/verify';
import UpdatePassword from './components/updatePassword/updatePass';
import Deactivate from './components/deactivate/deactivate';
import VerificaitonPage from './components/verificationpage/verificationPage'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
      <Route path = "/login" exact element = {<Login />}></Route>
      <Route path = "/register" exact element = {<Register />}></Route>
      <Route path = "/secure" exact element = {<App />}></Route>
      <Route path = "/unauthenticated/search" exact element = {<Search />}></Route>
      <Route path = "/unauthenticated/publiclists" exact element = {<SeePublicPlaylists />}></Route>
      <Route path = "/verify" exact element = {<Verify />}></Route>
      <Route path = "/updatePassword" exact element = {<UpdatePassword />}></Route>
      <Route path = "/deactivate" exact element = {<Deactivate />}></Route>
      <Route path = "/verified" exact element = {<VerificaitonPage />}></Route>
      


      <Route path = "*" element = {<p>404 Not Found</p>} />
  
  </Routes>
  </BrowserRouter>
);
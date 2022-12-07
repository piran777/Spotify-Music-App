import React from 'react';
import ReactDOM from 'react-dom/client';
import {Route, Routes, BrowserRouter, Outlet} from 'react-router-dom';
import './index.css';
import App from './components/SecureUser/App';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
      <Route path = "/login" exact element = {<Login />}></Route>
      <Route path = "/register" exact element = {<Register />}></Route>
      <Route path = "/secure" exact element = {<App />}></Route>
  </Routes>
  </BrowserRouter>
);
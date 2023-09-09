import './App.css';
import MainMenu from './menus/MainMenu';
import LoginMenu from './menus/LoginMenu';
import CreateAccountMenu from './menus/CreateAccountMenu';
import ProtectedRoute from './ProtectedRoute';
import InviteModal from './modals/InviteModal';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';

const VERIFY_URL = 'http://localhost:3001/auth/verify';

export const AuthContext = React.createContext(null);

function App() {

  const [authInfo, setAuthInfo] = useState(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {

    async function onLoad(){

      let accessToken = localStorage.getItem('accessToken');
      if(accessToken){
        let res = await axios.post(VERIFY_URL, JSON.stringify({ accessToken: accessToken }),
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );

        if(res?.status === 200){
          let resInfo = res?.data?.verified;
          setAuthInfo({ username: resInfo.username, userId: resInfo.userId, accessToken: accessToken });
        }
      }
    };

    onLoad();
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ authInfo: authInfo, setAuthInfo: setAuthInfo }}>
        <Routes>
          <Route path='/' element={<Navigate to='/login' replace={true} />} />
          <Route path='/login' element={<LoginMenu />} />
          <Route path='/create-account' element={<CreateAccountMenu />} />
          <Route path='/main-menu' 
            element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthContext.Provider>
    </>
  );
}

export default App;

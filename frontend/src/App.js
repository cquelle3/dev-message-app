import './App.css';
import MainMenu from './menus/MainMenu';
import LoginMenu from './menus/LoginMenu';
import CreateAccountMenu from './menus/CreateAccountMenu';
import ProtectedRoute from './ProtectedRoute';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const VERIFY_URL = 'http://localhost:3001/auth/verify';

function App() {

  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [verified, setVerified] = useState(false);

  useEffect(() => {
      const verifyToken = async () => {
        const res = await axios.post(VERIFY_URL, JSON.stringify({ accessToken: accessToken }), 
          {
            headers: { 'Content-Type': 'application/json' }
          }
        ).catch((error) => console.log(error));

        if(res?.status !== 200){
          setVerified(false);
        }
        else{
          setVerified(true);
        }
      }

      verifyToken().catch((error) => console.log(error));

  }, [accessToken]);

  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace={true} />} />
        <Route path='/login' element={<LoginMenu />} />
        <Route path='/create-account' element={<CreateAccountMenu />} />
        <Route path='/main-menu' 
          element={
            <ProtectedRoute verified={verified}>
              <MainMenu />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

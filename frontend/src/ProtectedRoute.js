import axios from 'axios';
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './App';

const VERIFY_URL = 'http://localhost:3001/auth/verify';

const ProtectedRoute = function({children}) {

        const { authInfo } = useContext(AuthContext);

        if(authInfo?.accessToken || localStorage.getItem('accessToken')){
            return(
                children
            );
        }
        else{
            return (
                <Navigate to='/login' replace />
            );
        }
}

export default ProtectedRoute;
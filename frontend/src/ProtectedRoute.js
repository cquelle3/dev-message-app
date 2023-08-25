import axios from 'axios';
import React from 'react';
import { Navigate } from 'react-router-dom';

const VERIFY_URL = 'http://localhost:3001/auth/verify';

const ProtectedRoute = function({verified, children}) {

        if(verified){
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
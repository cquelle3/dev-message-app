import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const LOGIN_URL = 'http://localhost:3001/auth/login';
const VERIFY_URL = 'http://localhost:3001/auth/verify';

function LoginMenu() {

    //use context to set authenticated user info throughout application
    const { setAuthInfo } = useContext(AuthContext);

    //used to navigate between routes
    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    useEffect(() => {
        if(localStorage.getItem('accessToken')){
            navigate('/main-menu');
        }
    });

    const handleSubmit = async (e) => {
        //prevents default event of reloading page on form submit
        e.preventDefault();

        try{
            const res = await axios.post(LOGIN_URL, JSON.stringify({username, password}), 
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            //clear the username and password strings
            setUsername('');
            setPassword('');

            const accessToken = res?.data?.accessToken;
            const userId = res?.data?.userId;
            //store the username, password, and access token in the app's global auth context
            setAuthInfo({ username: username, userId: userId, accessToken: accessToken });
            //add access token to local storage
            localStorage.setItem('accessToken', accessToken);
            //add user ID to local storage
            localStorage.setItem('userId', userId);
            //navigate to main menu
            navigate('/main-menu');
        } 
        catch(err) {
            if(!err?.response){
                setErrMsg('No Server Response');
            }
            else if(err.response?.status === 400){
                setErrMsg('Missing Username or Password');
            }
            else if(err.response?.status === 401){
                setErrMsg('Unauthorized');
            }
            else{
                setErrMsg('Login Failed');
            }
            //focus on the error message if there is an error
            //errRef.current.focus();
        }
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-red-400'>
            <form onSubmit={handleSubmit} className='pt-5 pb-5 px-10 bg-white shadow-md rounded'>
                <div className='pb-3'>
                    <label htmlFor='username' className='font-bold'>Username</label>
                    <input 
                        id='username' 
                        type='text'
                        ref={userRef} 
                        autoComplete='off'
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        className='w-full h-10 border rounded'
                        required
                    />
                </div>

                <div className='pb-3'>
                    <label htmlFor='password' className='font-bold'>Password</label>
                    <input 
                        id='password'
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='w-full h-10 border rounded'
                        required
                    />
                </div>

                <div className='flex flex-col'>
                    <button className='w-full h-10 font-bold bg-red-400 rounded'>Login</button>
                    <div className='flex flex-col pt-4'>
                        <Link to='/' className='text-red-400 font-medium hover:underline'>Forgot Password?</Link>
                        <Link to='/create-account' className='text-red-400 font-medium hover:underline'>Create Account</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginMenu;
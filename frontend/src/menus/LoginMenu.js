import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { AiFillWechat } from "react-icons/ai";

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
    const [invalidLogin, setInvalidLogin] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    //if user has an access token saved to browser, they are already logged in. navigate to main menu
    useEffect(() => {
        if(localStorage.getItem('accessToken')){
            navigate('/main-menu');
        }
    });

    const handleSubmit = async (e) => {
        //prevents default event of reloading page on form submit
        e.preventDefault();

        try{
            setInvalidLogin(false);

            //call backend to verify login credentials
            const res = await axios.post(LOGIN_URL, JSON.stringify({username, password}), 
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            //clear the username and password strings
            setUsername('');
            setPassword('');

            //get jwt access token and user id from backend
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
            if(err.response?.status === 401){
                setInvalidLogin(true);
            }
        }
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-slate-700'>

            <div className='flex items-center'>
                <h1 className='text-slate-100'>Dev-Chat</h1>
                <div className='pl-4'>
                    <AiFillWechat className='text-slate-100 text-6xl'></AiFillWechat>
                </div>
            </div>

            <form onSubmit={handleSubmit} className='pt-5 pb-5 px-10 bg-slate-500 shadow-md rounded'>
                <div className='pb-3'>
                    <label htmlFor='username' className='font-bold text-slate-100'>Username</label>
                    <input 
                        id='username' 
                        type='text'
                        ref={userRef} 
                        autoComplete='off'
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        className='w-full h-10 border rounded bg-slate-700 px-2 text-slate-100 font-semibold'
                        required
                    />
                </div>

                <div className='pb-3'>
                    <label htmlFor='password' className='font-bold text-slate-100'>Password</label>
                    <input 
                        id='password'
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='w-full h-10 border rounded bg-slate-700 px-2 text-slate-100 font-semibold'
                        required
                    />
                </div>

                {invalidLogin && <div className=''>
                    <p className='text-slate-100 font-semibold'>* Invalid username or password.</p>
                </div>}

                <div className='flex flex-col'>
                    <button className='w-full h-10 font-bold bg-slate-700 rounded text-slate-100 hover:bg-slate-100 hover:text-slate-700 transition ease-in' >Login</button>
                    <div className='pt-3'>
                        <Link to='/create-account' className='text-slate-100 font-medium hover:underline'>Create Account</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginMenu;
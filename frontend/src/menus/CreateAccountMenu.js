import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";

const REGISTER_URL = 'http://localhost:3001/auth/register';

function CreateAccountMenu() {

    //used to navigate between routes
    const navigate = useNavigate();

    //const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [invalidUsername, setInvalidUsername] = useState(false);
    const [accountCreated, setAccountCreated] = useState(false);

    const handleSubmit = async (e) => {
        //prevents default event of reloading page on form submit
        e.preventDefault();

        if(reEnterPassword === password && reEnterPassword.trim() !== '' && password.trim() !== ''){
            setInvalidUsername(false);
            try{
                const res = await axios.post(REGISTER_URL, JSON.stringify({username, password}),
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );

                if(res.status === 200){
                    setAccountCreated(true);
                }
            }
            catch(err){
                if(err?.response?.status === 401){
                    setInvalidUsername(true);
                }
            }
        }
    }

    function handlePassword(e){
        if(e.target.value !== reEnterPassword) setInvalidPassword(true);
        else setInvalidPassword(false);
        setPassword(e.target.value);
    }

    function handleReenterPassword(e){
        if(e.target.value !== password) setInvalidPassword(true);
        else setInvalidPassword(false);
        setReEnterPassword(e.target.value);
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-slate-700'>
            {!accountCreated && <form onSubmit={handleSubmit} className='pt-5 pb-5 px-10 bg-slate-500 shadow-md rounded'>
                <div className='pb-3'>
                    <label htmlFor='username' className='font-bold text-slate-100'>Username</label>
                    <input 
                        id='username' 
                        type='text'
                        autoComplete='off'
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        className='w-full h-10 border rounded bg-slate-700 px-2 text-slate-100 font-semibold'
                        required
                    />
                </div>

                {invalidUsername && <div className=''>
                    <p className='text-slate-100 font-semibold'>* Username already exists.</p>
                </div>}

                <div className='pb-3'>
                    <label htmlFor='password' className='font-bold text-slate-100'>Password</label>
                    <input 
                        id='password' 
                        type='password'
                        autoComplete='off'
                        onChange={(e) => handlePassword(e)}
                        value={password}
                        className='w-full h-10 border rounded bg-slate-700 px-2 text-slate-100 font-semibold'
                        required
                    />
                </div>

                <div className='pb-3'>
                    <label htmlFor='reenter-password' className='font-bold text-slate-100'>Confirm Password</label>
                    <input 
                        id='reenter-password' 
                        type='password'
                        autoComplete='off'
                        onChange={(e) => handleReenterPassword(e)}
                        value={reEnterPassword}
                        className='w-full h-10 border rounded bg-slate-700 px-2 text-slate-100 font-semibold'
                        required
                    />
                </div>

                {invalidPassword && <div className=''>
                    <p className='text-slate-100 font-semibold'>* Passwords do not match.</p>
                </div>}

                <div className='flex flex-col'>
                    <button className='w-full h-10 font-bold bg-slate-700 rounded text-slate-100'>Create Account</button>
                    <div className='flex flex-col pt-4'>
                        <Link to='/login' className='text-slate-100 font-medium hover:underline'>Already have an account?</Link>
                    </div>
                </div>
            </form>}

            {accountCreated && <div className='flex flex-col items-center justify-center w-96 h-96 pt-5 pb-5 px-10 bg-slate-500 shadow-md rounded'>
                <div className='pb-6'>
                    <h1 className='text-slate-100 text-2xl'>Created Account!</h1>
                </div>
                <AiFillCheckCircle className='text-slate-100 text-9xl'></AiFillCheckCircle>
                <div className='w-56 pt-10'>
                    <button className='w-full h-10 font-bold bg-slate-700 rounded text-slate-100' onClick={() => navigate('/login')}>Login Page</button>
                </div>
            </div>}
        </div>
    );
}

export default CreateAccountMenu;
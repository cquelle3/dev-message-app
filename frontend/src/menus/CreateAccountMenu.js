import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const REGISTER_URL = 'http://localhost:3001/auth/register';

function CreateAccountMenu() {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        //prevents default event of reloading page on form submit
        e.preventDefault();

        try{
            const res = await axios.post(REGISTER_URL, JSON.stringify({email, username, password}),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-red-400'>
            <form onSubmit={handleSubmit} className='pt-5 pb-5 px-10 bg-white shadow-md rounded'>
                <div className='pb-3'>
                    <label htmlFor='username' className='font-bold'>Email</label>
                    <input 
                        id='email' 
                        type='text'
                        autoComplete='off'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className='w-full h-10 border rounded'
                        required
                    />
                </div>

                <div className='pb-3'>
                    <label htmlFor='username' className='font-bold'>Username</label>
                    <input 
                        id='username' 
                        type='text'
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
                        autoComplete='off'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='w-full h-10 border rounded'
                        required
                    />
                </div>

                <div className='flex flex-col'>
                    <button className='w-full h-10 font-bold bg-red-400 rounded'>Create Account</button>
                    <div className='flex flex-col pt-4'>
                        <Link to='/login' className='text-red-400 font-medium hover:underline'>Already have an account?</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateAccountMenu;
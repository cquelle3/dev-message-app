import axios from "axios";
import { useEffect, useState } from "react";

const baseURL = "http://localhost:3001/api";

function LoginMenu() {

    const [users, setUsers] = useState([]);

    function getUsers(){
        axios.get(baseURL + '/users').then((res) => {
          setUsers(res.data);
        });
    }

    useEffect(() => {
        getUsers();
    });

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-red-400'>
            <form className='pt-5 pb-5 px-10 bg-white shadow-md rounded'>
                <div className='pb-3'>
                    <label for='username' className='font-bold'>Username</label>
                    <input id='username' className='w-full h-10 border rounded'/>
                </div>

                <div className='pb-3'>
                    <label for='password' className='font-bold'>Password</label>
                    <input id='password' className='w-full h-10 border rounded'/>
                </div>

                <div className='flex flex-col'>
                    <button className='w-full h-10 font-bold bg-red-400 rounded'>Login</button>
                    <div className='flex flex-col pt-4'>
                        <a href='https://localhost:3000' className='text-red-400 font-medium'>Forgot Password?</a>
                        <a href='https://localhost:3000' className='text-red-400 font-medium'>Create Account</a>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginMenu;
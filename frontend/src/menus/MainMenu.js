import { BsList } from "react-icons/bs";
import { BiHash } from "react-icons/bi";
import { BsSend } from "react-icons/bs";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import axios from "axios";

const USER_DATA_URL = "http://localhost:3001/api/userData";

function MainMenu() {

  //use context to set authenticated user info throughout application
  const { authInfo, setAuthInfo } = useContext(AuthContext);

  //used to navigate between routes
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const [userData, setUserData] = useState(authInfo?.accessToken);

  useEffect(() => {

    async function getUserData(){

      if(authInfo?.userId){
        const userId = authInfo?.userId;    
    
        let resUserData = await axios.get(`${USER_DATA_URL}/${userId}`,
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );

        console.log(resUserData?.data[0]);
        setUserData(resUserData?.data[0]);
      }
    }

    getUserData();
    
  }, [authInfo]);

  function logout(){
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    setAuthInfo(null);
    navigate('/login');
  }

  return (
    <div className='flex h-screen'>
      {/*SIDEBAR*/}
      <div className={`flex h-full bg-red-200 p-5 pt-8 ${open ? 'w-96' : 'w-20'} duration-300`}>
        
        {/*SIDEBAR TOGGLE*/}
        {/*<BsList className='text-2xl' onClick={() => setOpen(!open)}></BsList>*/}
        
        {/*SERVER LIST*/}
        <div className=''>
          <div className='bg-red-100 w-12 h-12 rounded-full'></div>
          <div className='bg-red-100 w-12 h-12 rounded-full'></div>
          <div className='bg-red-100 w-12 h-12 rounded-full'></div>
          <div className='bg-red-100 w-12 h-12 rounded-full'></div>
          <div className='bg-red-100 w-12 h-12 rounded-full'></div>
        </div>

        {/*SERVER CHANNELS*/}
        <div className={`${open ? 'visible' : 'invisible'} pt-10`}>
          <div className='flex items-center pb-3 hover:bg-blue-100 rounded'>
            <BiHash></BiHash><p className='pl-2 font-medium select-none'>Test Channel 1</p>
          </div>
          <div className='flex items-center pb-3 hover:bg-blue-100 rounded'>
            <BiHash></BiHash><p className='pl-2 font-medium select-none'>Test Channel 2</p>
          </div>
          <div className='flex items-center pb-3 hover:bg-blue-100 rounded'>
            <BiHash></BiHash><p className='pl-2 font-medium select-none'>Test Channel 3</p>
          </div>
        </div>

        <button onClick={logout}>logout</button>
      </div>

      {/*BODY*/}
      <div className='flex flex-col p-7 w-full h-full bg-blue-100'>
        {/*CONTENT OF THE PAGE BODY*/}

        {/*CONTENT HEADER*/}
        <div className='border-solid border-b-2 border-red-200'>
          <h1 className='text-2xl font-semibold pb-4'>Test Channel 1</h1>
        </div>

        {/*MESSAGES*/}
        <div className='pt-10 overflow-auto'>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 1</p>
              <p className='font-medium'>test message 1.</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 2</p>
              <p className='font-medium'>hello!</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 1</p>
              <p className='font-medium'>hi</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 1</p>
              <p className='font-medium'>test message 1.</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 2</p>
              <p className='font-medium'>hello!</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 1</p>
              <p className='font-medium'>hi</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 1</p>
              <p className='font-medium'>test message 1.</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 2</p>
              <p className='font-medium'>hello!</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 1</p>
              <p className='font-medium'>hi</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 1</p>
              <p className='font-medium'>test message 1.</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 2</p>
              <p className='font-medium'>hello!</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 1</p>
              <p className='font-medium'>hi</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 1</p>
              <p className='font-medium'>test message 1.</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 2</p>
              <p className='font-medium'>hello!</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 1</p>
              <p className='font-medium'>hi</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 1</p>
              <p className='font-medium'>test message 1.</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 2</p>
              <p className='font-medium'>hello!</p>
            </div>
          </div>

          <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>User 1</p>
              <p className='font-medium'>butt</p>
            </div>
          </div>

          {/*MESSAGE*/}
          <div className='flex items-center pb-6'>
            {/*PROFILE PICTURE*/}
            <div className='bg-red-100 w-12 h-12 min-w-12 min-h-12 rounded-full'></div>
            <div className='pl-3'>
              {/*USERNAME*/}
              <p className='font-medium'>User 1</p>
              {/*MESSAGE*/}
              <p className='font-medium break-all'>aaaaaaaaahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</p>
            </div>
          </div>

        </div>


        {/*MESSAGE BOX*/}
        <div className='flex items-center mt-auto w-full bg-red-200 rounded'>
          <input type='text' spellCheck='false' placeholder='Message' className='w-full h-12 p-4 font-medium bg-transparent focus:outline-0'/>
          <div className='pl-4 pr-4'>
            <BsSend className='w-5 h-5'></BsSend>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;

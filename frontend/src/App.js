import './App.css';
import { BsList } from "react-icons/bs";
import { BiHash } from "react-icons/bi";
import { BsSend } from "react-icons/bs";
import { useState } from 'react';

function App() {
  const [open, setOpen] = useState(true);

  return (
    <div className='flex h-screen'>
      {/*SIDEBAR*/}
      <div className={`h-full bg-red-200 p-5 pt-8 ${open ? 'w-96' : 'w-20'} duration-300`}>
        
        {/*SIDEBAR TOGGLE*/}
        <BsList className='text-2xl' onClick={() => setOpen(!open)}></BsList>
        
        {/*SERVER CHANNELS*/}
        <div className={`${open ? 'visible' : 'invisible'} pt-10`}>
          <div className='flex items-center pb-3 hover:bg-blue-100 rounded'>
            <BiHash></BiHash><p className='pl-2 font-medium'>Test Channel 1</p>
          </div>
          <div className='flex items-center pb-3 hover:bg-blue-100 rounded'>
            <BiHash></BiHash><p className='pl-2 font-medium'>Test Channel 2</p>
          </div>
          <div className='flex items-center pb-3 hover:bg-blue-100 rounded'>
            <BiHash></BiHash><p className='pl-2 font-medium'>Test Channel 3</p>
          </div>
        </div>
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
              <p className='font-medium'>hi</p>
            </div>
          </div>

        </div>


        {/*MESSAGE BOX*/}
        <div className='flex items-center mt-auto w-full bg-red-200 rounded'>
          <input type='text' placeholder='Message' className='w-full h-12 p-4 font-medium bg-transparent focus:outline-0'/>
          <div className='pl-4 pr-4'>
            <BsSend className='w-5 h-5'></BsSend>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

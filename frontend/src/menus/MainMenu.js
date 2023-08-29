import { BsList } from "react-icons/bs";
import { BiHash } from "react-icons/bi";
import { BsSend } from "react-icons/bs";
import { HiPlus } from "react-icons/hi";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import axios from "axios";

const USER_DATA_URL = "http://localhost:3001/api/userData";
const SERVER_URL = "http://localhost:3001/api/server";


function ServerList({servers, loadServer, addNewServer}) {
  const serverList = []; 
  if(servers) {
    servers.forEach((server) => {
      serverList.push(
        <div className='pb-2'>
            <div className='bg-red-100 w-12 h-12 rounded-full' onClick={() => loadServer(server)}></div>
        </div>
      );
    });
  }

  return (
    <div className='flex flex-col'>
      {serverList}
      <div>
        <div className='flex items-center justify-center bg-blue-100 w-12 h-12 rounded-full' onClick={() => addNewServer()}><HiPlus className='text-xl'></HiPlus></div>
      </div>
    </div>
  );
}

function ChannelList({channels, loadChannel}) {
  const channelList = [];
  if(channels){
    channels.forEach((channel) => {
      let channelName = Object.keys(channel)[0];
      channelList.push(
        <div className='flex items-center pb-3 hover:bg-blue-100 rounded' onClick={() => loadChannel(channel)}>
            <BiHash></BiHash><p className='pl-2 font-medium select-none'>{channelName}</p>
        </div>
      );
    });
  }

  return (
    <div className='pt-10`'>
      {channelList}  
    </div>
  );
}

function Channel({channelData}) {
  let channelHeader = "";
  const messageList = [];

  if(channelData){
    //set header name to channel name
    channelHeader = Object.keys(channelData)[0];

    //push messages to array
    channelData[channelHeader].forEach((message) => {
      messageList.push(
        <div className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>Username</p>
              <p className='font-medium'>message...</p>
            </div>
        </div>
      );
    });
  }

  return (
    <>
      <div className='flex flex-col p-7 w-full h-full bg-blue-100'>
        {/*CONTENT OF THE CHANNEL*/}

        {/*CONTENT HEADER*/}
        <div className='border-solid border-b-2 border-red-200'>
          <h1 className='text-2xl font-semibold pb-4'>{channelHeader}</h1>
        </div>

        {/*MESSAGES*/}
        <div className='pt-10 overflow-auto'>
          {messageList}
        </div>

        {/*MESSAGE BOX*/}
        <div className='flex items-center mt-auto w-full bg-red-200 rounded'>
          <input type='text' spellCheck='false' placeholder='Message' className='w-full h-12 p-4 font-medium bg-transparent focus:outline-0'/>
          <div className='pl-4 pr-4'>
            <BsSend className='w-5 h-5'></BsSend>
          </div>
        </div>

      </div>
    </>
  );
}

function MainMenu() {

  //use context to set authenticated user info throughout application
  const { authInfo, setAuthInfo } = useContext(AuthContext);

  //used to navigate between routes
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [server, setServer] = useState(null);
  const [channel, setChannel] = useState(null);

  //get user data when initializing
  useEffect(() => {
    async function getUserData(){
      if(authInfo?.userId){
        const userId = authInfo?.userId;    
        let resUserData = await axios.get(`${USER_DATA_URL}/${userId}`,
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
        setUserData(resUserData?.data[0]);
      }
    }
    getUserData();
  }, [authInfo]);

  //logout of account by clearing tokens and auth info
  function logout(){
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    setAuthInfo(null);
    navigate('/login');
  }

  //load the selected server
  async function loadServer(serverId) {
    let res = await axios.get(`${SERVER_URL}/${serverId}`, 
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    setServer(res?.data);
    setChannel(null);
  }

  //add a new server
  async function addNewServer(){
    //create a new server
    let serverRes = await axios.post(SERVER_URL, JSON.stringify({ name: 'test', members: [userData.userId], channels: [{'default': []}] }), 
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    //update users server list
    let newServerList = userData?.servers;
    newServerList.push(serverRes?.data?._id);
    let userDataRes = await axios.put(`${USER_DATA_URL}/${userData._id}`, JSON.stringify({ servers: newServerList }), 
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    //update current displayed user data
    setUserData(userDataRes?.data);
  }

  function loadChannel(channel){
    //set current channel to the selected channel from the server
    setChannel(channel);
  }

  return (
    <div className='flex h-screen'>
      {/*SIDEBAR*/}
      <div className={`flex h-full bg-red-200 p-5 pt-8 ${open ? 'w-96' : 'w-20'} duration-300`}>
        
        {/*SIDEBAR TOGGLE*/}
        {/*<BsList className='text-2xl' onClick={() => setOpen(!open)}></BsList>*/}
        
        {/*SERVER LIST*/}
        <ServerList servers={userData?.servers} loadServer={loadServer} addNewServer={addNewServer}></ServerList>

        {/*SERVER CHANNELS*/}
        <ChannelList channels={server?.channels} loadChannel={loadChannel}></ChannelList>

        {/*LOGOUT BUTTON*/}
        <button onClick={logout}>logout</button>
      </div>

      {/*CHANNEL*/}
      <Channel channelData={channel}></Channel>

    </div>
  );
}

export default MainMenu;

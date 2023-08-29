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
    servers.forEach((server, i) => {
      serverList.push(
        <div key={i} className='pb-2'>
            <div className='bg-red-100 w-12 h-12 rounded-full' onClick={() => loadServer(server)}></div>
        </div>
      );
    });
  }

  return (
    <div className='flex flex-col h-screen px-3 pt-3 bg-red-400'>
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
    let channelNames = Object.keys(channels);
    channelNames.forEach((channelName, i) => {
      channelList.push(
        <div key={i} className='flex items-center py-2 hover:bg-blue-100 rounded' onClick={() => loadChannel({ channelName: channelName, messages: channels[channelName] })}>
          <p className='pl-2 font-medium select-none'>{channelName}</p>
        </div>
      );
    });
  }

  return (
    <div className='w-56 px-2 pt-4 bg-red-200'>
      <div className=''>
        <p className='text-xs font-semibold'>Channels - 1</p>
      </div>
      {channelList}  
    </div>
  );
}

function MemberList({members}) {
  
}

function Channel({channelData, sendMessage}) {
  let channelHeader = "";
  const messageList = [];
  let messageBox = <></>;

  const [message, setMessage] = useState("");

  if(channelData){
    //set header name to channel name
    channelHeader = channelData?.channelName;

    //push messages to array
    channelData?.messages.forEach((message, i) => {
      messageList.push(
        <div key={i} className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>Username</p>
              <p className='font-medium'>{message}</p>
            </div>
        </div>
      );
    });

    //set messageBox to the message box html
    messageBox =
    <div className='flex items-center mt-auto w-full bg-red-200 rounded'>
      <input 
        type='text' 
        spellCheck='false' 
        placeholder='Message' 
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => { if(e.key === 'Enter') {sendMessage(message); setMessage('');}}}
        value={message}
        className='w-full h-12 p-4 font-medium bg-transparent focus:outline-0'/>
      <div className='pl-4 pr-4'>
        <BsSend className='w-5 h-5'></BsSend>
      </div>
    </div>
  }
  else{
    messageBox = <></>
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
        {messageBox}
      </div>
    </>
  );
}

function MainMenu() {

  //use context to set authenticated user info throughout application
  const { authInfo, setAuthInfo } = useContext(AuthContext);

  //used to navigate between routes
  const navigate = useNavigate();

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
    let serverRes = await axios.post(SERVER_URL, JSON.stringify({ name: 'test', members: [userData.userId], channels: {'default': []} }), 
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

  async function sendMessage(message){
    let msgList = channel.messages;
    msgList.push(message);
    let serverUpdate = server;
    serverUpdate.channels[channel.channelName] = msgList;

    let serverRes = await axios.put(`${SERVER_URL}/${server._id}`, JSON.stringify({channels: serverUpdate.channels}), 
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    setServer(serverRes.data);
    setChannel({ channelName: channel.channelName, messages: serverRes.data.channels[channel.channelName] });
  }

  return (
    <div className='flex'>

      {/*SERVER LIST*/}
      <ServerList servers={userData?.servers} loadServer={loadServer} addNewServer={addNewServer}></ServerList>

      <div className='flex flex-col h-screen w-screen bg-blue-100'>
        
        {/*SERVER HEADER*/}
        <div className='h-20 bg-blue-500'>
          
        </div>

        <div className='flex flex-1 overflow-auto'>
          {/*CHANNEL SIDEBAR*/}
          <div className='flex'>
            {/*SERVER CHANNELS*/}
            <ChannelList channels={server?.channels} loadChannel={loadChannel}></ChannelList>
          </div>

          {/*CHANNEL*/}
          <div className='flex-1 w-96'>
            <Channel channelData={channel} sendMessage={sendMessage}></Channel>
          </div>


          {/*MEMBER SIDEBAR*/}
          <div className='bg-red-200 px-2 pt-4 w-96'>

            {/*MEMBER LIST*/}
            <div className='pb-2'>
              <p className='text-xs font-semibold'>Members - 1</p>
            </div>

            <div className='flex items-center pb-2'>
                <div className='bg-blue-100 w-10 h-10 rounded-full'></div>
                <div className='pl-3'>
                  <p className='font-medium'>Username</p>
                </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default MainMenu;

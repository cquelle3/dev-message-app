import { BsEmojiLaughing, BsEmojiSmile } from "react-icons/bs";
import { HiPlus } from "react-icons/hi";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import axios from "axios";
import { socket } from "../Socket/Socket";
import EmojiPicker from "emoji-picker-react";

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
  var channelsTitle = "";
  if(channels){
    let channelNames = Object.keys(channels);
    channelNames.forEach((channelName, i) => {
      channelList.push(
        <div key={i} className='flex items-center py-2 hover:bg-blue-100 rounded' onClick={() => loadChannel({ channelName: channelName, messages: channels[channelName] })}>
          <p className='pl-2 font-medium select-none'>{channelName}</p>
        </div>
      );
    });

    channelsTitle = `Channels - ${Object.keys(channels)?.length}`;
  }

  return (
    <div className='flex'>
      <div className='w-56 px-2 pt-4 bg-red-200'>
        <div className=''>
          <p className='text-xs font-semibold'>{channelsTitle}</p>
        </div>
        {channelList}  
      </div>
    </div>
  );
}

function MemberList({members, memberData}){
  const memberList = [];
  var membersTitle = "";
  if(members){
    members.forEach((memberId, i) => {
      let memberUsername = memberData[memberId]?.username;
      memberList.push(
        <div key={i} className='flex items-center pb-2'>
            <div className='bg-blue-100 w-10 h-10 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>{memberUsername}</p>
            </div>
        </div>
      )
    });

    membersTitle = `Members - ${members?.length}`;
  }

  return (
    <div className='bg-red-200 px-2 pt-4 w-96'>
      {/*MEMBER LIST*/}
      <div className='pb-2'>
        <p className='text-xs font-semibold'>{membersTitle}</p>
      </div>
      {memberList}
    </div>
  );
}

function ServerHeader(){
  return (
    <div className='h-20 bg-blue-500'>
    </div>
  )
}

function Channel({channelData, memberData, sendMessage}) {
  let channelHeader = "";
  const messageList = [];
  let messageBox = <></>;

  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  if(channelData){
    //set header name to channel name
    channelHeader = channelData?.channelName;

    //push messages to array
    channelData?.messages.forEach((message, i) => {
      let msgUserId = message?.userId;
      let msgUsername = memberData[msgUserId]?.username;
      messageList.push(
        <div key={i} className='flex items-center pb-6'>
            <div className='bg-red-100 w-12 h-12 rounded-full'></div>
            <div className='pl-3'>
              <p className='font-medium'>{msgUsername}</p>
              <p className='font-medium'>{message?.text}</p>
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
        <div className='p-1 w-8 h-8 hover:bg-slate-500 rounded'>
          <BsEmojiSmile className='w-full h-full' onClick={() => setShowEmojis(!showEmojis)}></BsEmojiSmile>
        </div>
      </div>
    </div>
  }
  else{
    messageBox = <></>
  }

  return (
    <div className='flex-1 w-96'>
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
        {showEmojis && <EmojiPicker onEmojiClick={(e) => {setMessage(message + '' + e.emoji); console.log(e)}}></EmojiPicker>}
        {messageBox}
      </div>
    </div>
  );
}

function MainMenu() {

  //use context to set authenticated user info throughout application
  const { authInfo, setAuthInfo } = useContext(AuthContext);

  //used to navigate between routes
  const navigate = useNavigate();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [userData, setUserData] = useState(null);
  const [server, setServer] = useState(null);
  const [channel, setChannel] = useState(null);
  const [memberData, setMemberData] = useState(null);

  /*SOCKET IO COMMUNICATION*/
  useEffect(() => {
    function onConnect() {
      console.log('connected to socket.io');
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('disconnected from socket.io');
      setIsConnected(false);
    }

    function onMessage(value){
      console.log(value);
    }

    async function onMessageResponse(data){
      console.log('got message');
      
      console.log(server);
      console.log(data);

      if(server?._id === data?.serverId){
        console.log('refreshing server');
        let serverRes = await axios.get(`${SERVER_URL}/${server?._id}`, 
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
        setServer(serverRes?.data);
        setChannel({ channelName: channel.channelName, messages: serverRes.data.channels[channel.channelName] });
      }
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);
    socket.on('messageResponse', onMessageResponse);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onMessage);
      socket.off('messageResponse', onMessageResponse);
    }
  });

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
        setUserData(resUserData?.data);
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
    
    //get server members data
    let newMemberData = {};
    for(let memberId of res?.data.members){
      let memberRes = await axios.get(`${USER_DATA_URL}/${memberId}`,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      newMemberData[memberId] = memberRes?.data;
    }

    console.log(newMemberData);

    setMemberData(newMemberData);
    setServer(res?.data);
    setChannel(null);
  }

  //add a new server
  async function addNewServer(){
    //create a new server
    let serverRes = await axios.post(SERVER_URL, JSON.stringify({ name: 'test', members: [userData.userId], channels: {'general': []} }), 
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
    //create new message object
    let newMsg = {
      text: message,
      userId: userData?.userId,
      timestamp: new Date(),
    }

    //push message to message list
    let msgList = channel.messages;
    msgList.push(newMsg);
    let serverUpdate = server;
    serverUpdate.channels[channel.channelName] = msgList;

    //save to server
    let serverRes = await axios.put(`${SERVER_URL}/${server._id}`, JSON.stringify({channels: serverUpdate.channels}), 
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    //emit message to socket.io to notify other users
    socket.emit('message', {message: newMsg, channelName: channel?.channelName, serverId: server?._id});
  }

  return (
    <div className='flex'>

      {/*SERVER LIST*/}
      <ServerList servers={userData?.servers} loadServer={loadServer} addNewServer={addNewServer}></ServerList>

      {/*SERVER*/}
      <div className='flex flex-col h-screen w-screen bg-blue-100'>
        
        {/*SERVER HEADER*/}
        <ServerHeader></ServerHeader>

        {/*SERVER CONTENT*/}
        <div className='flex flex-1 overflow-auto'>
          {/*CHANNEL SIDEBAR*/}
          <ChannelList channels={server?.channels} loadChannel={loadChannel}></ChannelList>

          {/*CHANNEL*/}
          <Channel channelData={channel} memberData={memberData} sendMessage={sendMessage}></Channel>

          {/*MEMBER SIDEBAR*/}
          <MemberList members={server?.members} memberData={memberData}></MemberList>    
        </div>
      </div>
    </div>
  );
}

export default MainMenu;

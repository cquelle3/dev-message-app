import { BsDot, BsEmojiSmile, BsFillPersonPlusFill, BsPersonDashFill, BsTrashFill } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import { HiPlus } from "react-icons/hi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BiSolidCrown } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { FaTrashCan } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri"; 
import { ImExit } from "react-icons/im";
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import axios from "axios";
import { socket } from "../Socket/Socket";
import EmojiPicker from "emoji-picker-react";
import InviteModal from "../modals/InviteModal";
import PendingInvitesModal from "../modals/PendingInvitesModal";
import CreateServerModal from "../modals/CreateServerModal";
import CreateChannelModal from "../modals/CreateChannelModal";
import SettingsModal from "../modals/SettingsModal";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { createConfirmation } from "react-confirm";
import ConfirmModal from "../modals/ConfirmModal";

const USER_DATA_URL = `${process.env.REACT_APP_SERVER_URL}/api/userData`;
const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/api/server`;

const confirm = createConfirmation(ConfirmModal);

const InfoPopup = React.forwardRef(({arrowProps, hasDoneInitialMeasure, popupText, padding, ...props}, ref) => (
  <div {...props} ref={ref} className={padding}>
    <div className='bg-slate-500 rounded px-2 pb-1'>
      <p className='text-slate-100 mb-0'>{popupText}</p>
    </div>
  </div>
));

function ServerList({servers, loadServer, createServer, serverNames}) {

  const serverList = []; 
  if(servers) {
    //create html for servers
    servers.forEach((server, i) => {
      let servername = serverNames[server];
      let serverIcon = servername !== undefined ? servername[0] : '';
      serverList.push(
        <div key={i} className='pb-2'>
            <OverlayTrigger placement="right" overlay={<InfoPopup popupText={serverNames[server]} padding='pl-2'></InfoPopup>}>
              <div className='flex items-center justify-center bg-slate-300 w-12 h-12 font-medium text-slate-500 text-lg rounded-full cursor-pointer' onClick={() => loadServer(server)}>{serverIcon}</div>
            </OverlayTrigger>
        </div>
      );
    });
  }

  return (
    <div className='flex flex-col overflow-y-auto h-screen px-3 pt-3 bg-slate-900'>
      {serverList}
      <div>
        <OverlayTrigger placement="right" overlay={<InfoPopup popupText="Create Server" padding='pl-2'></InfoPopup>}>
          <div className='flex items-center justify-center bg-slate-700 w-12 h-12 rounded-full cursor-pointer' onClick={() => createServer()}><HiPlus className='text-xl text-slate-100'></HiPlus></div>
        </OverlayTrigger>
      </div>
    </div>
  );
}

function ChannelList({channels, loadChannel, createChannel, deleteChannel, isOwner}) {
  const channelList = [];
  var channelsTitle = "";
  var addChannelButton = <></>;

  if(channels){
    let channelNames = Object.keys(channels);
    channelNames.forEach((channelName, i) => {
      channelList.push(
        <div key={channelName} className='flex items-center'>
          <div className='flex items-center pt-2.5 w-44 hover:bg-slate-600 rounded cursor-pointer' onClick={() => loadChannel({ channelName: channelName, messages: channels[channelName] })}>
            <p className='truncate pl-2 font-medium text-slate-100 select-none'># {channelName}</p>
          </div>
          {isOwner && channelNames.length > 1 &&

            <div className='pb-1.5 pl-2'>
              <OverlayTrigger placement="left" overlay={<InfoPopup popupText="Delete Channel" padding='pr-2'></InfoPopup>}>
                <div>
                  <BsTrashFill className='text-slate-100 text-xl cursor-pointer' onClick={() => deleteChannel(channelName)}></BsTrashFill>
                </div>
              </OverlayTrigger>
            </div>
          }
        </div>
      );
    });

    channelsTitle = `Channels - ${Object.keys(channels)?.length}`;
    addChannelButton = 
      <div className='pl-3'>
        <OverlayTrigger placement="top" overlay={<InfoPopup popupText="Create Channel" padding='pb-2'></InfoPopup>}>
          <div>
            <AiOutlinePlusCircle className='text-2xl text-slate-100 cursor-pointer' onClick={() => createChannel()}></AiOutlinePlusCircle>
          </div>
        </OverlayTrigger>
      </div>
  }

  return (
    <div className='flex'>
      <div className='w-56 px-2 pt-4 bg-slate-700 overflow-y-auto'>
        <div className='flex'>
          <div className='pt-1'>
            <p className='text-xs font-semibold text-slate-100 select-none'>{channelsTitle}</p>
          </div>
          {isOwner && addChannelButton}
        </div>
        <div>
          {channelList} 
        </div>
      </div>
    </div>
  );
}

function MemberList({members, memberData, ownerId, userId, isOwner, removeMember}){
  const memberList = [];
  var membersTitle = "";
  if(members){
    members.forEach((memberId, i) => {
      let memberUsername = memberData[memberId]?.username;
      let memberIcon = memberData[memberId]?.username !== undefined ? memberData[memberId]?.username[0] : '';
      memberList.push(
        <div key={i} className='flex items-center'>
          <div className='flex items-center w-96 px-2 hover:bg-slate-600 rounded'>
              <div className='flex items-center justify-center shrink-0 bg-slate-300 w-10 h-10 font-medium text-slate-500 text-lg rounded-full select-none'>{memberIcon}</div>
              {userId === memberId && <div className='absolute ml-8 mt-8 shrink-0 w-3 h-3 rounded bg-slate-100 outline outline-slate-700'></div>}
              <div className='flex w-64 pl-3 pt-3'>
                <p className='truncate font-medium text-slate-100 select-none'>{memberUsername}</p>
                {ownerId === memberId && <div className='pl-3 pt-0.5'>
                  <BiSolidCrown className='text-slate-100 text-xl'></BiSolidCrown>
                </div>}
              </div>
          </div>
          {ownerId !== memberId && isOwner && 
            <div className='ml-auto pl-3'>
              <OverlayTrigger placement="left" overlay={<InfoPopup popupText="Kick Member" padding='pr-2'></InfoPopup>}>
                <div>
                  <BsPersonDashFill className='text-slate-100 text-2xl cursor-pointer' onClick={() => removeMember(memberId, true)}></BsPersonDashFill>
                </div>
              </OverlayTrigger>
            </div>
          }
        </div>
      )
    });

    membersTitle = `Members - ${members?.length}`;
  }

  return (
    <div className='bg-slate-700 px-2 pt-4 w-96 overflow-y-auto'>
      {/*MEMBER LIST*/}
      <div className='flex items-center pb-2'>
        <p className='text-xs font-semibold text-slate-100 select-none'>{membersTitle}</p>
        {!isOwner && members && 
          <div className='ml-auto pb-2'>
            <OverlayTrigger placement="left" overlay={<InfoPopup popupText="Leave Channel" padding='pr-2'></InfoPopup>}>
              <div>
                <ImExit className='text-2xl text-slate-100 cursor-pointer' onClick={() => removeMember(userId, false)}></ImExit>
              </div>
            </OverlayTrigger>
          </div>
        }
      </div>
      <div>
        {memberList}
      </div>
    </div>
  );
}

function ServerHeader({server, invites, inviteUser, openInvites, openSettings, isOwner, deleteServer}){

  let inviteList = [];
  if(invites){
    inviteList = Object.keys(invites);
  }
  else{
    inviteList = [];
  }

  return (
    <>
    <div className='flex h-20 w-full'>
      {/*SERVER HEADER*/}
      <div className='flex items-center w-full p-5 bg-slate-800'>
        {isOwner && 
          <OverlayTrigger placement="bottom" overlay={<InfoPopup popupText="Delete Server"></InfoPopup>}>
            <div className='pb-2'>
              <RiDeleteBin2Fill className='text-3xl text-slate-100 cursor-pointer' onClick={() => deleteServer()}></RiDeleteBin2Fill>
            </div>
          </OverlayTrigger>
        }

        <div className='w-1/2 pl-10'>
          <h1 className='text-2xl truncate font-semibold text-slate-100 select-none'>{server?.name}</h1>
        </div>

        <OverlayTrigger placement="bottom" overlay={<InfoPopup popupText="Settings"></InfoPopup>}>
          <div className='ml-auto pb-2'>
            <IoMdSettings className='text-2xl text-slate-100 cursor-pointer' onClick={() => openSettings()}></IoMdSettings>
          </div>
        </OverlayTrigger>

        <div className='pl-10'>
          <OverlayTrigger placement="bottom" overlay={<InfoPopup popupText="Invites"></InfoPopup>}>
            <div className='pb-2' onClick={() => openInvites()}>
              {inviteList.length > 0 && <div className='absolute rounded w-3 h-3 ml-4 bg-slate-100 outline outline-2.5 outline-slate-800'></div>}
              <FiMail className='text-2xl text-slate-100 cursor-pointer' onClick={() => openInvites()}></FiMail>
            </div>
          </OverlayTrigger>
        </div>

        {server && isOwner && 
          <div className='pl-10'>
            <OverlayTrigger placement="bottom" overlay={<InfoPopup popupText="Send Invites"></InfoPopup>}>
              <div className='pb-2'>
                <BsFillPersonPlusFill className='text-2xl text-slate-100 cursor-pointer' onClick={() => inviteUser()}></BsFillPersonPlusFill>
              </div>
            </OverlayTrigger>
          </div>
        }
      </div>
    </div>
    </>
  )
}

function Channel({channelData, memberData, sendMessage}) {
  let channelHeader = "";
  const messageList = [];
  let messageBox = <></>;

  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  function handleEmoji(e){
    let emoji = e.emoji;
    let newMsg = message + '' + emoji;
    setMessage(newMsg);
    setShowEmojis(false);
  }

  if(channelData?.messages){
    //set header name to channel name
    channelHeader = channelData?.channelName;

    //push messages to array
    channelData?.messages.forEach((message, i) => {
      let msgUserId = message?.userId;
      let msgUsername = memberData[msgUserId]?.username !== undefined ? memberData[msgUserId]?.username : '[user removed]';
      let msgIcon = memberData[msgUserId]?.username !== undefined ? memberData[msgUserId]?.username[0] : '';
      messageList.push(
        <div key={i} className='flex pb-6'>
            <div className='flex items-center justify-center shrink-0 bg-slate-300 w-14 h-14 font-medium text-slate-500 text-xl rounded-full select-none'>{msgIcon}</div>
            <div className='pl-3'>
              <p className='font-medium text-lg text-slate-400 mb-0'>{msgUsername}</p>
              <p className='break-all font-medium text-lg text-slate-100'>{message?.text}</p>
            </div>
        </div>
      );
    });

    //set messageBox to the message box html
    messageBox =
    <div className='flex items-center mt-auto w-full bg-slate-700 rounded'>
      <input 
        type='text' 
        spellCheck='false' 
        placeholder='Message' 
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => { if(e.key === 'Enter') {sendMessage(message); setMessage('');}}}
        value={message}
        className='w-full h-12 p-4 font-medium text-slate-100 bg-transparent focus:outline-0'/>
      <div className='pl-4 pr-4'>
        <div className='p-1 w-8 h-8 hover:bg-slate-500 rounded'>
          <BsEmojiSmile className='w-full h-full text-slate-100' onClick={() => setShowEmojis(!showEmojis)}></BsEmojiSmile>
        </div>
      </div>
    </div>
  }
  else{
    messageBox = <></>
  }

  return (
    <div className='relative flex-1 w-96'>
      <div className='flex flex-col p-7 w-full h-full bg-slate-500'>
        {/*CONTENT OF THE CHANNEL*/}

        {/*CHANNEL TITLE*/}
        <div className='border-b-4 border-slate-400 pb-2'>
          <h1 className='truncate text-2xl font-semibold text-slate-100 select-none'>{channelHeader}</h1>
        </div>

        {/*MESSAGES*/}
        <div className='pt-10 overflow-auto'>
          {messageList}
        </div>

        {/*MESSAGE BOX*/}
        {showEmojis && 
          <div className='absolute right-7 bottom-20'>
            <EmojiPicker onEmojiClick={(e) => {handleEmoji(e)}}></EmojiPicker>
          </div>
        }
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
  const [serverNames, setServerNames] = useState({});
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPendingInvModal, setShowPendingInvModal] = useState(false);
  const [showCreateServModal, setShowCreateServModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  /*SOCKET IO COMMUNICATION*/
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    }
  });



  //get user data when initializing
  useEffect(() => {
    async function getUserDataAuth(){
      const userId = authInfo?.userId;    
      let resUserData = await axios.get(`${USER_DATA_URL}/${userId}`, {headers: { 'Content-Type': 'application/json' }});
      setUserData(resUserData?.data);

      //if the user has servers, load the first one
      if(resUserData?.data?.servers.length > 0){
        loadServer(resUserData?.data?.servers[0]);
      }
    }

    async function onRefreshUserDataResponse(data){
      let resUserData = await axios.get(`${USER_DATA_URL}/${data.userId}`, {headers: { 'Content-Type': 'application/json' }});
      setUserData(resUserData?.data);

      if(data.currServer && resUserData?.data?.servers.indexOf(data.currServer) === -1){
        setServer({});
        setChannel({});
        setMemberData({});
      }
    }

    if(authInfo?.userId){
      getUserDataAuth();
      socket.on('refreshUserDataResponse' + authInfo.userId, onRefreshUserDataResponse);
      return () => socket.off('refreshUserDataResponse' + authInfo.userId, onRefreshUserDataResponse);
    }
  }, [authInfo]);



  //use effect for setting up message receiving sockets for servers, and server refresh
  useEffect(() => {
    function onMessageResponse(data){
      if(data){
        if(server?._id === data?.serverId && userData?.userId !== data?.message?.userId){
          server.channels[data?.channelName].push(data.message);
          if(channel?.channelName === data?.channelName){
            setChannel({ channelName: channel.channelName, messages: server.channels[channel.channelName] });
          }
        }
      }
    }

    async function onRefreshServerResponse(data){
      if(data?.kickedUser !== userData?.userId){
        loadServer(server?._id);
      }
    }

    //create socket for message responses for current server for user
    if(server){
      socket.on('messageResponse' + server._id, onMessageResponse); 
      socket.on('refreshServerResponse' + server._id, onRefreshServerResponse);
      return () => {
        socket.off('messageResponse' + server._id, onMessageResponse);
        socket.off('refreshServerResponse' + server._id, onRefreshServerResponse);
      }
    }
  }, [server, channel, userData]);



  //use effect for getting server names
  useEffect(() => {
    function getServerNames(){
      if(userData){
        userData.servers.forEach(async (serverId) => {
          let nameRes = await axios.get(`${SERVER_URL}/name/${serverId}`, {headers: { 'Content-Type': 'application/json' }});
          serverNames[serverId] = nameRes?.data.name;
        });
      }
    }

    getServerNames();
  }, [userData, serverNames]);



  //load the selected server
  async function loadServer(serverId) {
    let currServerId = server?._id;

    let res = await axios.get(`${SERVER_URL}/${serverId}`, {headers: { 'Content-Type': 'application/json' }});
    
    //get server members data
    let newMemberData = {};
    for(let memberId of res?.data.members){
      let memberRes = await axios.get(`${USER_DATA_URL}/${memberId}`, {headers: { 'Content-Type': 'application/json' }});
      newMemberData[memberId] = memberRes?.data;
    }

    setMemberData(newMemberData);
    setServer(res?.data);

    if(channel && currServerId === serverId){
      if(res?.data.channels[channel.channelName] === undefined){
        setChannel(null);
      }
      else{
        setChannel({ channelName: channel.channelName, messages: res?.data.channels[channel.channelName] });
      }
    }
    else{
      setChannel(null);
    }
  }



  //add a new server
  async function addNewServer(serverName){
    //create a new server
    let serverRes = await axios.post(SERVER_URL, JSON.stringify({ name: serverName, members: [userData.userId], channels: {'general': []}, ownerId: userData.userId }), {headers: { 'Content-Type': 'application/json' }});
    
    //update users server list
    let newServerList = userData?.servers;
    newServerList.push(serverRes?.data?._id);
    serverNames[serverRes?.data?._id] = serverName;
    let userDataRes = await axios.put(`${USER_DATA_URL}/${userData._id}`, JSON.stringify({ servers: newServerList }), {headers: { 'Content-Type': 'application/json' }});

    //update current displayed user data
    setUserData(userDataRes?.data);
  }

  

  async function deleteServer(){
    if(await confirm({confirmation: `Are you sure you want to delete '${serverNames[server._id]}'?`})){
      //remove server from each members server list
      for(let memberId of server.members){
        let memDataRes = await axios.get(`${USER_DATA_URL}/${memberId}`, {headers: { 'Content-Type': 'application/json' }});
        let memberServers = memDataRes.data.servers;
        let index = memberServers.indexOf(server._id);
        memberServers.splice(index, 1);
        await axios.put(`${USER_DATA_URL}/${memDataRes.data._id}`, JSON.stringify({servers: memberServers}), {headers: { 'Content-Type': 'application/json' }});
        
        //refresh user data
        socket.emit('refreshUserData', {userId: memberId, currServer: server._id});
      }
      await axios.delete(`${SERVER_URL}/${server._id}`, {headers: { 'Content-Type': 'application/json' }});
    }
  }



  function loadChannel(channel){
    //set current channel to the selected channel from the server
    setChannel(channel);
  }



  async function addNewChannel(channelName){
    let currChannels = server?.channels;
    currChannels[channelName] = [];

    let serverRes = await axios.put(`${SERVER_URL}/${server._id}`, JSON.stringify({channels: currChannels}), {headers: { 'Content-Type': 'application/json' }});

    //refresh server for other members
    socket.emit('refreshServer', {serverId: server._id});
  }


  async function deleteChannel(channelName){
    //if user confirms confirmation modal, delete channel
    if(await confirm({confirmation: `Are you sure you want to delete '${channelName}'?`})){
      let currChannels = server?.channels;
      delete currChannels[channelName];

      let serverRes = await axios.put(`${SERVER_URL}/${server._id}`, JSON.stringify({channels: currChannels}), {headers: { 'Content-Type': 'application/json' }});
      
      //refresh server for other members
      socket.emit('refreshServer', {serverId: server._id});
    }
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
    let serverRes = await axios.put(`${SERVER_URL}/${server._id}`, JSON.stringify({channels: serverUpdate.channels}), {headers: { 'Content-Type': 'application/json' }});

    //emit message to socket.io to notify other users
    socket.emit('message', {message: newMsg, channelName: channel?.channelName, serverId: server?._id});
  }



  function inviteUser(){
    setShowInviteModal(true);
  }



  async function acceptInvite(serverId){
    let currServers = userData.servers;
    let currInvites = userData.invites;

    //pull server user was invited to 
    let serverRes = await axios.get(`${SERVER_URL}/${serverId}`, {headers: { 'Content-Type': 'application/json' }});
    //if the server exists
    if(serverRes?.data){

      //if the user does not have the server in their list already, add it to server list
      if(currServers.findIndex((id) => id === serverId) === -1){
        currServers.push(serverId);
      }
      //delete invite
      delete currInvites[serverId];

      //save user changes
      let userDataUpd = await axios.put(`${USER_DATA_URL}/${userData._id}`, JSON.stringify({servers: currServers, invites: currInvites}), {headers: { 'Content-Type': 'application/json' }});

      //update server members to add new user
      let mems = serverRes?.data.members;
      if(mems.findIndex((id) => id === userData.userId) === -1){
        mems.push(userData.userId);
      }
      let serverUpd = await axios.put(`${SERVER_URL}/${serverId}`, JSON.stringify({members: mems}), {headers: { 'Content-Type': 'application/json' }});

      //assign current users data to updated data
      setUserData(userDataUpd?.data);

      //refresh server for other members
      socket.emit('refreshServer', {serverId: serverId});
    }
    else{
      //delete invite
      delete currInvites[serverId];
      //save user changes
      let userDataUpd = await axios.put(`${USER_DATA_URL}/${userData._id}`, JSON.stringify({invites: currInvites}), {headers: { 'Content-Type': 'application/json' }});
      //assign current users data to updated data
      setUserData(userDataUpd?.data)
    }
  }



  async function removeMember(memberId, isKicked){
    var confirmationText = '';
    if(isKicked){
      confirmationText = `Are you sure you want to kick '${memberData[memberId]?.username}' from the server?`;
    }
    else{
      confirmationText = `Are you sure you want to leave '${serverNames[server._id]}'?`;
    }

    if(await confirm({confirmation: confirmationText})){
      //get members data, remove server from their server list
      let getMemberRes = await axios.get(`${USER_DATA_URL}/${memberId}`, {headers: { 'Content-Type': 'application/json' }});
      let memberServers = getMemberRes?.data?.servers;
      let serverIndex = memberServers.indexOf(server._id);
      memberServers.splice(serverIndex, 1);
      await axios.put(`${USER_DATA_URL}/${getMemberRes.data._id}`, JSON.stringify({servers: memberServers}), {headers: { 'Content-Type': 'application/json' }});

      //refresh user data for removed user
      socket.emit('refreshUserData', {userId: memberId, currServer: server._id});

      //remove member from the server member list
      let serverMembers = server.members;
      let memberIndex = serverMembers.indexOf(memberId);
      serverMembers.splice(memberIndex, 1);
      await axios.put(`${SERVER_URL}/${server._id}`, JSON.stringify({members: serverMembers}), {headers: { 'Content-Type': 'application/json' }});

      //refresh server for other members
      socket.emit('refreshServer', {serverId: server._id, kickedUser: memberId});
    }
  }


  
  return (
    <>
      <div className='flex'>

        {/*SERVER LIST*/}
        <ServerList servers={userData?.servers} loadServer={loadServer} createServer={() => setShowCreateServModal(true)} serverNames={serverNames}></ServerList>

        {/*SERVER*/}
        <div className='flex flex-col h-screen w-screen'>
          
          {/*SERVER HEADER*/}
          <ServerHeader server={server} invites={userData?.invites} inviteUser={inviteUser} openInvites={() => setShowPendingInvModal(true)} openSettings={() => setShowSettingsModal(true)} isOwner={server?.ownerId === userData?.userId} deleteServer={deleteServer}></ServerHeader>

          {/*SERVER CONTENT*/}
          <div className='flex flex-1 overflow-auto'>
            {/*CHANNEL SIDEBAR*/}
            <ChannelList channels={server?.channels} loadChannel={loadChannel} createChannel={() => setShowCreateChannelModal(true)} deleteChannel={deleteChannel} isOwner={server?.ownerId === userData?.userId}></ChannelList>

            {/*CHANNEL*/}
            <Channel channelData={channel} memberData={memberData} sendMessage={sendMessage}></Channel>

            {/*MEMBER SIDEBAR*/}
            <MemberList members={server?.members} memberData={memberData} ownerId={server?.ownerId} userId={userData?.userId} isOwner={server?.ownerId === userData?.userId} removeMember={removeMember}></MemberList>    
          </div>
        </div>
      </div>

      <InviteModal show={showInviteModal} onHide={() => setShowInviteModal(false)} server={server} currUserData={userData} serverNames={serverNames} socket={socket}></InviteModal>
      <PendingInvitesModal show={showPendingInvModal} onHide={() => setShowPendingInvModal(false)} currUserData={userData} acceptInvite={acceptInvite}></PendingInvitesModal>
      <CreateServerModal show={showCreateServModal} onHide={() => setShowCreateServModal(false)} addNewServer={addNewServer}></CreateServerModal>
      <CreateChannelModal show={showCreateChannelModal} onHide={() => setShowCreateChannelModal(false)} server={server} addNewChannel={addNewChannel}></CreateChannelModal>
      <SettingsModal show={showSettingsModal} onHide={() => setShowSettingsModal(false)} setAuthInfo={setAuthInfo} navigate={navigate}></SettingsModal>
    </>
  );
}

export default MainMenu;
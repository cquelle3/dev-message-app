import axios from "axios";
import { useState } from "react";
import { Modal, Toast, ToastContainer } from "react-bootstrap";
import { Form } from "react-bootstrap";

const USER_URL = `${process.env.REACT_APP_SERVER_URL}/api/users`;
const USER_DATA_URL = `${process.env.REACT_APP_SERVER_URL}/api/userData`;

function InviteModal(props){

    const [userSearch, setUserSearch] = useState("");
    const [userSearchList, setUserSearchList] = useState(null);
    const [inviteSent, setInviteSent] = useState(false);

    //send invite to user
    async function inviteUser(user){
        setInviteSent(false);

        let res = await axios.get(`${USER_DATA_URL}/${user._id}`, {headers: { 'Content-Type': 'application/json' }}); 

        let invites = res.data.invites;
        if(invites === undefined){
            invites = {};
            invites[props.server._id] = {userName: props.currUserData.username, serverName: props.serverNames[props.server._id]};
        }
        else{
            invites[props.server._id] = {userName: props.currUserData.username, serverName: props.serverNames[props.server._id]};
        }
    
        let resUpd = await axios.put(`${USER_DATA_URL}/${res.data._id}`, JSON.stringify({invites: invites}), {headers: { 'Content-Type': 'application/json' }});

        //refresh user data for invited user
        props.socket.emit('refreshUserData', {userId: user._id});

        setInviteSent(true);
    }

    //search for users
    async function searchUsers(){
        if(userSearch.trim() !== ""){
            let res = await axios.get(`${USER_URL}/search/${userSearch}`, {headers: { 'Content-Type': 'application/json' }});
            let searchList = res?.data.filter((user) => user._id !== props.currUserData.userId)
            setUserSearchList(searchList);
        }
        else{
            setUserSearchList(null);
        }
    }
    
    let userList = [];
    if(userSearchList){
        userSearchList.forEach((user, i) => {
            userList.push(
                <div key={i} className='flex w-full pb-2'>
                    <div className='flex items-center justify-center bg-slate-300 w-10 h-10 rounded-full text-slate-500 font-medium text-lg'>{user.username[0]}</div>
                    <div className='pt-2 pl-2'>
                        <p className='font-semibold'>{user.username}</p>
                    </div>

                    <div className='ml-auto pt-2'>
                        <button 
                            className='font-semibold border-none bg-blue-100 text-blue-700 rounded w-14 hover:bg-blue-100 active:bg-blue-300 active:ring-3 active:border-blue-500'
                            onClick={() => inviteUser(user)}
                        >Invite</button>
                    </div>
                </div>
            );
        });
    }

    return(
        <Modal centered show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Send Invites</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className='pb-3'>
                    <Form.Group>
                        <Form.Label>Search</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="username"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            onKeyDown={(e) => {if(e.key === 'Enter') { e.preventDefault(); searchUsers();}}}
                            autoFocus
                        />
                    </Form.Group>
                </Form>
                <div className='pt-3 px-3 max-h-96 overflow-auto'>
                    {userList} 
                </div>

                <ToastContainer className='pt-10 pl-14'>
                    <Toast onClose={() => setInviteSent(false)} show={inviteSent} delay={1500} autohide>
                        <Toast.Body>Invite sent!</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Modal.Body>
        </Modal>
    );
}

export default InviteModal;
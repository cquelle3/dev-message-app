import axios from "axios";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";

const USER_URL = "http://localhost:3001/api/users";
const USER_DATA_URL = "http://localhost:3001/api/userData";

function InviteModal(props){

    const [userSearch, setUserSearch] = useState("");
    const [userSearchList, setUserSearchList] = useState(null);

    //send invite to user
    async function inviteUser(user){
        let res = await axios.get(`${USER_DATA_URL}/${user._id}`, 
            {
                headers: { 'Content-Type': 'application/json' }
            }
        ); 

        console.log(res);
        
        let invites = res.data.invites;
        if(invites === undefined){
            invites = {};
            invites[props.server._id] = {userName: props.currUserData.username, serverName: props.serverNames[props.server._id]};
        }
        else{
            invites[props.server._id] = {userName: props.currUserData.username, serverName: props.serverNames[props.server._id]};//props.currUserData.username;
        }
    
        let resUpd = await axios.put(`${USER_DATA_URL}/${res.data._id}`, JSON.stringify({invites: invites}), 
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        //refresh user data for invited user
        props.socket.emit('refreshUserData', {userId: user._id});
    }

    //search for users
    async function searchUsers(){
        if(userSearch.trim() !== ""){
            let res = await axios.get(`${USER_URL}/search/${userSearch}`, 
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setUserSearchList(res?.data);
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
                    <div className='bg-blue-100 w-10 h-10 rounded-full'></div>
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
                <Modal.Title>Invite Users</Modal.Title>
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
            </Modal.Body>
        </Modal>
    );
}

export default InviteModal;
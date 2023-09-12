import axios from "axios";
import { Form, Modal } from "react-bootstrap";

const USER_DATA_URL = "http://localhost:3001/api/userData";
const SERVER_URL = "http://localhost:3001/api/server";

function PendingInvitesModal(props){

    let inviteList = [];
    if(props?.currUserData?.invites){
        let serverIds = Object.keys(props.currUserData.invites);

        for(let serverId of serverIds){;
            inviteList.push(
                <div key={serverId} className='flex'>
                    <div className=''>
                        <p className='font-semibold'>'{props.currUserData.invites[serverId].userName}' invited you to join '{props.currUserData.invites[serverId].serverName}'</p>
                    </div>
                    <div className='ml-auto pt-3'>
                        <button 
                            className='font-semibold outline outline-1 outline-blue-700 text-blue-700 rounded w-14 hover:bg-blue-100'
                            onClick={() => props.acceptInvite(serverId)}
                        >Accept</button>
                    </div>
                </div>
            );
        }
    }

    return(
        <Modal centered show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Invites</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {inviteList}
            </Modal.Body>
        </Modal>
    );
}

export default PendingInvitesModal;
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function CreateChannelModal(props){
    
    const [channelName, setChannelName] = useState("");
    const [invalidName, setInvalidName] = useState(false);
    const [invalidMsg, setInvalidMsg] = useState("");

    function createChannel(){
        let currChannels = Object.keys(props.server.channels);
        if(currChannels.findIndex((name) => name.trim() === channelName.trim()) === -1 && channelName.trim() !== ""){
            setInvalidName(false);
            setInvalidMsg("");
            props.addNewChannel(channelName.trim());
            props.onHide();
        }
        else{
            if(channelName.trim() === "") setInvalidMsg("Channel name cannot be blank.");
            else setInvalidMsg("Channel name already exists.");
            setInvalidName(true);
        }
    }

    return(
        <Modal centered show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Create Channel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Channel Name</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="channel"
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                            autoFocus
                            isInvalid={invalidName}
                        />
                        <Form.Control.Feedback type="invalid">{invalidMsg}</Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => createChannel()}>Create</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateChannelModal;
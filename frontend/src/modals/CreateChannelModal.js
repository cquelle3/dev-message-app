import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function CreateChannelModal(props){
    
    const [channelName, setChannelName] = useState("");

    function createChannel(){
        let currChannels = Object.keys(props.server.channels);
        if(currChannels.findIndex((name) => name === channelName) === -1){
            props.addNewChannel(channelName);
            props.onHide();
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
                        />
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
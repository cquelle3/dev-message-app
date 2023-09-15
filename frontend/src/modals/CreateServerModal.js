import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";


function CreateServerModal(props){
    
    const [serverName, setServerName] = useState("");

    function createServer(){
        props.addNewServer(serverName);
        props.onHide();
    }

    return(
        <Modal centered show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Create Server</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Server Name</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="server"
                            value={serverName}
                            onChange={(e) => setServerName(e.target.value)}
                            onKeyDown={(e) => {if(e.key === 'Enter') { e.preventDefault(); }}}
                            autoFocus
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => createServer()}>Create</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateServerModal;
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function SettingsModal(props){

    function logout(){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        props.setAuthInfo(null);
        props.navigate('/login');
    }

    return(
        <Modal centered show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button onClick={() => logout()}>Logout</Button>
            </Modal.Body>
        </Modal>
    );
}

export default SettingsModal;
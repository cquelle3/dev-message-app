import { Button, Modal } from "react-bootstrap";
import { confirmable } from "react-confirm";

const ConfirmModal = ({show, proceed, confirmation, options}) => (
        <Modal centered show={show} onHide={() => proceed(false)}>
            <Modal.Header>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className='font-semibold text-lg'>{confirmation}</p>
                <div className='flex'>
                    <div className='ml-auto'>
                        <Button variant="secondary" onClick={() => proceed(false)}>Cancel</Button>
                    </div>
                    <div className='pl-2'>
                        <Button variant="primary" onClick={() => proceed(true)}>Confirm</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
);

export default confirmable(ConfirmModal);
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Message } from 'semantic-ui-react';
import Axios from '../../../../services/Axios.jsx';

const CreateReferralCodeModal = (props) => {

    const [referralCode, setReferralCode] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');
    const [errors, setErrors] = useState([]);

    const createReferralCode = async () => {

        const storedData = JSON.parse(localStorage.getItem('userData'));

        let res;

        if (storedData) {
            try {
                res = await Axios.post('/referralcode', {
                    referralCode: referralCode
                },{
                    headers: {
                        'Authorization': 'Bearer ' + storedData.token
                    }
                });
            } catch (error) { }
        }

        if (res?.data?.httpStatus == 'Success') {
            setSuccessMessage(res.data.message);
            setWarningMessage('');
            setErrors([]);
            setTimeout(() => props.setModalVisibility(false), 3000);
            props.setReferralCode(referralCode);
        }

        if (res?.data?.httpStatus == 'REFERRAL_CODE_ALREADY_ASSOCIATED_WITH_ANOTHER_USER'
            || res?.data?.httpStatus == 'REFERRAL_CODE_ALREADY_ASSOCIATED_WITH_THIS_USER') {
            setSuccessMessage('');
            setWarningMessage(res.data.message);
            setErrors([]);
        }

        if (res?.data?.httpStatus == 'Error') {
            setSuccessMessage('');
            setWarningMessage('');
            setErrors(res.data.errors);
        }

    }

    return (
        <Modal
            dimmer="default"
            size="tiny"
            open={props.open}>
            <Modal.Header>Create Referral Code</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <label style={{ color: '#A663CC' }}>Your Unique Referral Code</label>
                        <input onChange={(event) => setReferralCode(event.target.value)} placeholder='Enter referral code' />
                    </Form.Field>
                </Form>
                { successMessage.trim().length > 0 ? <Message color="green">{successMessage}</Message> : null }
                { warningMessage.trim().length > 0 ? <Message color="orange">{warningMessage}</Message> : null }
                { errors.length > 0 ? <Message color="red" list={errors}/> : null }
            </Modal.Content>
            <Modal.Actions>
                <Button color="grey" onClick={createReferralCode}>
                    Create
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default CreateReferralCodeModal;
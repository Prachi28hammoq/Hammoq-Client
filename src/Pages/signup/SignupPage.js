import React, { useState, useEffect } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import './SignupPage.css';
import Axios from '../../services/Axios.jsx';

const SignupPage = () => {

    const history = useHistory();

    const [fullName, setFullName] = useState('');
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState([]);

    const navigateToLoginPage = () => {
        history.push('/login');
    }

    const clearForm = () => {
        setFullName('');
        setEmailId('');
        setPassword('');
    }

    const signupUser = async () => {

        let res = {
            data: {
                httpStatus: 'Error',
                errors: ['Something\'s not right. Unable to contact server']
            }
        }

        try {
            res = await Axios.post('/signup', {
                fullName,
                emailId,
                password
            });
        } catch (error) { }


        if (res.data.httpStatus == 'Success') {
            setErrors([]);
            setSuccessMessage(res.data.message);
            clearForm();
        }

        if (res.data.httpStatus == 'Error') {
            setSuccessMessage('');
            setErrors(res.data.errors);
        }

    }

    return (
        <div className="signup-page-container">
            <div className='signup-page-box'>
                <Form>
                    <Form.Field>
                        <label>Full Name</label>
                        <input value={fullName} placeholder='Full Name' onChange={(e) => setFullName(e.target.value)} />
                    </Form.Field>
                    <Form.Field>
                        <label>Email Id</label>
                        <input value={emailId} placeholder='Email Id' onChange={(e) => setEmailId(e.target.value)} />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input type="password" value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    </Form.Field>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0px' }}>
                        <Button color="blue" onClick={signupUser}>Signup</Button>
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <label>Existing Affiliate? </label><a href="javascript:void(0)" onClick={navigateToLoginPage}>Login</a>
                    </div>
                </Form>
            </div>
            <div className="signup-page-success-message">{successMessage.length > 0 ? <Message color="green">{successMessage}</Message> : null}</div>
            <div className="signup-page-error-messages">{errors.length > 0 ? <Message warning list={errors} /> : null}</div>
        </div>
    );
}

export default SignupPage;
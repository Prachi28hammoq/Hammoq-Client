import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import './LoginPage.css';
import Axios from '../../services/Axios.jsx';
import { AuthContext } from '../../context/AuthContext.js';

const LoginPage = (props) => {

    const history = useHistory();

    const auth = useContext(AuthContext);

    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState([]);

    const navigateToSignupPage = () => {
        history.push('/signup');
    }
    
    const clearForm = () => {
        setEmailId('');
        setPassword('');
    }

    const loginInfluencer = async () => {

        let res = {
            data: {
                httpStatus: 'Error',
                errors: ['Something\'s not right. Unable to contact server']
            }
        }

        try {
            res = await Axios.post('/authentication/login', {
                emailId,
                password
            });
        } catch (error) {}

        if (res.data.httpStatus == 'Success') {
            setErrors([]);
            setSuccessMessage(res.data.message);
            clearForm();
            setTimeout(() => {auth.login(res.data.userFullName, res.data.token)}, 3000);
        }

        if (res.data.httpStatus == 'Error') {
            setSuccessMessage('');
            setErrors(res.data.errors);
        }

    }

    return (
        <div className="login-page-container">
            <div className='login-page-box'>
                <Form>
                    <Form.Field>
                        <label>Email Id</label>
                        <input value={emailId} onChange={(e) => setEmailId(e.target.value)} placeholder='Email Id' />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' />
                    </Form.Field>
                    <div style={{display: 'flex', justifyContent: 'flex-end', margin: '10px 0px'}}>
                        <Button color="blue" onClick={loginInfluencer}>Login</Button>
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <label>New Affiliate? </label><a href="javascript:void(0)" onClick={navigateToSignupPage}>Signup</a>
                    </div>
                </Form>
            </div>
            <div className="login-page-success-message">{successMessage.length > 0 ? <Message color="green">{successMessage}</Message> : null}</div>
            <div className="login-page-error-messages">{errors.length > 0 ? <Message warning list={errors} /> : null}</div>
        </div>
    );
}

export default LoginPage;
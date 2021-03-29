import React, { useEffect, useState } from 'react';
import Axios from "../../services/Axios";
import './MessagesTextArea.css';

const MessagesTextArea = (props) => {

    const [message, setMessage] = useState('');
    const [uploadedFile, setUploadedFile] = useState('');
    const [uploadingFile, setUploadingFile] = useState(false);

    const sendMessage = async () => {

        if(uploadingFile)
           return;

        if (uploadedFile.trim().length > 0) {
            let res = await Axios.post('/messagesNeo/sendMessage', {
                "message": { "messageType": "File", "messageBody": uploadedFile.trim() },
                "fromUserId": props.clientId,
                "toUserIds": [...props.agentsAllocatedToClient]
            })

            setMessage('');
            setUploadedFile('');
            return;
        }

        if (message.trim().length > 0) {
            let res = await Axios.post('/messagesNeo/sendMessage', {
                "message": { "messageType": "Text", "messageBody": message.trim() },
                "fromUserId": props.clientId,
                "toUserIds": [...props.agentsAllocatedToClient]
            })

            setMessage('');
            setUploadedFile('');

            //props.setRefreshDisplayArea(true);
        }
    }

    const onChangeHandler = async (event) => {
        setMessage('');
        setUploadingFile(true);
        const data = new FormData();
        data.append('file', event.target.files[0]);
        let res = await Axios.post('/messagesNeo/uploadFile', data);
        setUploadedFile(res?.data?.publicUrl || '');
        setUploadingFile(false);
    }

    return (
        <div className="message-textarea-container">
            <div className="message-textarea">
                <textarea className="message-textarea-input"
                    placeholder="Message HAMMOQ support"
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                    onKeyPress={event => { if (event.key === 'Enter') sendMessage() }} />
            </div>
            <div className="message-textarea-controls">
                <span className="message-icons-right">
                    <button className="send-message-button" onClick={sendMessage} disabled={uploadingFile}>
                        <i className="fas fa-paper-plane" style={{ margin: '5px', color: 'white' }}></i>
                    </button>
                </span>
                <span className="message-icons">
                    <button className="message-attachment-button" style={{marginTop: '10px', marginLeft: '10px'}} disabled={uploadingFile}>
                        <span style={{ position: 'relative' }}>
                            <input type="file" name="file" accept="image/*" onChange={onChangeHandler} onClick={(event) => event.target.value = ''} style={{ opacity: 0, position: 'absolute' }} />
                            <i class="fas fa-paperclip" style={{ margin: '5px', color: 'white' }} />
                            
                        </span>
                    </button>
                    {uploadedFile.trim().length > 0 ? <img src={uploadedFile} height={35} width={35} style={{marginLeft: '10px'}}></img>:null}
                    {uploadingFile == true ? <i class="fa fa-upload" aria-hidden="true" style={{marginLeft: '10px', color: '#8E7DBE'}} /> : null}
                </span>
            </div>
        </div>
    );
}

export default MessagesTextArea;
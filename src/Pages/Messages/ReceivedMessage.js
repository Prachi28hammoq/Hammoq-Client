import React from 'react';
import './ReceivedMessage.css';

const ReceivedMessage = (props) => {


    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
            <div className="received-message">
                {props.message.message.messageType == 'Text' ? <div style={{ wordWrap: 'break-word' }}>{props.message.message.messageBody}</div> : null}
                {props.message.message.messageType == 'File' ? <img src={props.message.message.messageBody} width={150} height={150} /> : null}
                <div className="received-message-username-and-date">{props.message.fromUser.userName}&nbsp;({props.message.creationDate})</div>
            </div>
        </div>);
}

export default ReceivedMessage;
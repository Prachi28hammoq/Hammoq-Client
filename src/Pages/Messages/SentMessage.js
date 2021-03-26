import React from 'react';
import './SentMessage.css';

const SentMessage = (props) => {


    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
            <div className="sent-message">
                {props.message.message.messageType == 'Text' ? <div style={{wordWrap: 'break-word'}}>{props.message.message.messageBody}</div> : null}
                {props.message.message.messageType == 'File' ? <img src={props.message.message.messageBody} width={150} height={150}/> : null}
                <div className="sent-message-username-and-date">{props.message.fromUser.userName}&nbsp;({props.message.creationDate})</div>
            </div>
        </div>);

}

export default SentMessage;
import React from 'react';
import './ReceivedMessage.css';
import * as moment from 'moment'

const ReceivedMessage = (props) => {


    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
            <div className="received-message">
                {props.message.message.messageType == 'Text' ? <div style={{ wordWrap: 'break-word' }}>{props.message.message.messageBody}</div> : null}
                {props.message.message.messageType == 'File' ? <img src={props.message.message.messageBody} width={150} height={150} /> : null}
                <div className="received-message-username-and-date">From {props.message.fromUser.userName} {moment(props.message.creationDate).startOf().fromNow()}</div>
            </div>
        </div>);
}

export default ReceivedMessage;
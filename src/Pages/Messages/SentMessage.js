import React from 'react';
import './SentMessage.css';
import * as moment from 'moment'

const SentMessage = (props) => {


    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
            <div className="sent-message">
                {props.message.message.messageType === 'Text' ? <div style={{wordWrap: 'break-word'}}>{props.message.message.messageBody}</div> : null}
                {props.message.message.messageType === 'File' ? <img alt="sentImage" src={props.message.message.messageBody} width={150} height={150}/> : null}
                <div className="sent-message-username-and-date">{moment(props.message.creationDate).startOf().fromNow()}</div>
            </div>
            
        </div>);

}

export default SentMessage;
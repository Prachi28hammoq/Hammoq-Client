import React, { useState, useEffect } from 'react';
import './Messages.css';
import MessagesContentArea from './MessagesContentArea';

const Messages = (props) => {

    return (
        <div className="client_messages_container">
            <MessagesContentArea />
        </div>
    )
}

export default Messages;
import React, { useEffect, useState } from 'react';
import './MessagesContentArea.css';
import MessagesDisplayArea from './MessagesDisplayArea';
import MessagesTextArea from './MessagesTextArea';

const MessagesContentArea = (props) => {

    const [refreshDisplayArea, setRefreshDisplayArea] = useState(false);
    const [clientId, setClientId] = useState("");
    const [agentsAllocatedToClient, setAgentsAllocatedToClient] = useState([]);

    return (
        <div className="messages-content-area">
            <MessagesDisplayArea
                refreshDisplayArea={refreshDisplayArea}
                setRefreshDisplayArea={setRefreshDisplayArea}
                clientId={clientId}
                setClientId={setClientId}
                agentsAllocatedToClient={agentsAllocatedToClient}
                setAgentsAllocatedToClient={setAgentsAllocatedToClient}
            />
            <MessagesTextArea setRefreshDisplayArea={setRefreshDisplayArea}
                              clientId={clientId}
                              agentsAllocatedToClient={agentsAllocatedToClient} />
        </div>
    );
}

export default MessagesContentArea;
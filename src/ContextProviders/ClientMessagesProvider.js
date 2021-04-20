import React, { useState, useEffect } from "react";
import socket from "../services/socket";
import Axios from "../services/Axios";
import { useHistory } from "react-router";
export const ClientMessagesContext = React.createContext();

Axios.defaults.headers["x-access-token"] = localStorage.getItem("token");


const ClientMessagesProvider = (props) => {

    const [contextUnreadMessagesCount, setContextUnreadMessagesCount] = useState(0);
    const [contextClientId, setContextClientId] = useState("");

    const history = useHistory();

    useEffect(() => {

        mountContext();

        return () => {
            //socket.disconnect();
        };

    }, [contextClientId])

    useEffect(() => {

        mountContext();

        return () => {
            //socket.disconnect();
        };

    }, [history.location.pathname])

    const mountContext = () => {

        if (localStorage.getItem("token") && contextClientId.length > 0) {
            
            //socket.disconnect();
            socket.connect();

            socket.on('connect', function () {
                socket.emit('joinMessageRoomForClient', localStorage.getItem("token"));
            });

            socket.emit('getTotalUnreadMessagesForClient', { userId: contextClientId, roomId: localStorage.getItem("token") });

            socket.on('newMessage', function (data) {
                socket.emit('getTotalUnreadMessagesForClient', { userId: contextClientId, roomId: localStorage.getItem("token") });
            })

            socket.on('markedAsRead', function (data) {
                socket.emit('getTotalUnreadMessagesForClient', { userId: contextClientId, roomId: localStorage.getItem("token") });
            })

            socket.on('totalUnreadMessagesForClient', function (data) {
                setContextUnreadMessagesCount(data?.totalUnreadMessages)
            });
        }

    }

    return (

        <ClientMessagesContext.Provider value={{
            contextUnreadMessagesCount,
            setContextClientId
        }}>
            {props.children}
        </ClientMessagesContext.Provider>

    );
}

export default ClientMessagesProvider;
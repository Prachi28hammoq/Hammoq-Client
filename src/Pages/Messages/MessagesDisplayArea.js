import React, { useState, useEffect, useRef } from 'react';
import Axios from "../../services/Axios";
import './MessagesDisplayArea.css';
import ReceivedMessage from './ReceivedMessage';
import SentMessage from './SentMessage';
import socket from "../../services/socket";

Axios.defaults.headers["x-access-token"] = localStorage.getItem("token");

const MessagesDisplayArea = (props) => {

    const [messages, setMessages] = useState([]);
    const [offsetReverse, setOffsetReverse] = useState(0);
    const [limitReverse] = useState(7);
    const [offsetNormal] = useState(0);
    const [limitNormal] = useState(1);
    const [scrollLock, setScrollLock] = useState(false);
    const [unreadMessagesList, setUnreadMessagesList] = useState([]);


    const messageDisplayAreaRef = useRef();

    useEffect(() => {

        const getClientIdAndAgentsAllocatedToClient = async () => {
            let res = await Axios.get('/messagesNeo/getClientId');

            if (res?.data?.clientId) {
                props.setClientId(res?.data?.clientId)
            }

            if (res?.data?.clientId) {
                await Axios.post('/messagesNeo/joinRoom', {
                    "userType": "CLIENT",
                    "userId": res?.data?.clientId
                });
            }

            if (res?.data?.clientId) {
                res = await Axios.get('/messagesNeo/getAgentsAllocatedToClient/' + res?.data?.clientId);

                if (res?.data?.agentsAllocatedToClient) {
                    props.setAgentsAllocatedToClient([...res?.data?.agentsAllocatedToClient.filter(agentId => agentId !== "undefined")])
                }
            }
        }

        getClientIdAndAgentsAllocatedToClient();

        socket.disconnect();
        socket.connect();

        socket.on('connect', function () {
            socket.emit('joinMessageRoomForClient', localStorage.getItem("token"));
        });

        socket.on('newMessage', function (data) {
            setMessages(messages => [...messages, data.message]);
        })

        return () => {
            socket.disconnect();
        };

    }, [])

    const getUrlForMessagesInReverseOrder = () => {

        let url

        if (props.clientId) {
            url = 'messagesNeo/messagesReverse/' + props.clientId + '?&limit=' + limitReverse;

            url = url + '&offset=' + offsetReverse;

        }

        return url;
    }

    const getUrlForMessagesInNormalOrder = () => {

        let url

        if (props.clientId) {
            url = 'messagesNeo/messagesNormal/' + props.clientId + '?&limit=' + limitNormal;

            url = url + '&offset=' + offsetNormal;
        }

        return url;
    }

    useEffect(() => {

        getMessagesInReverseOrder();

    }, [getUrlForMessagesInReverseOrder()])

    useEffect(() => {

        if (props.refreshDisplayArea === true)
            getMessagesInNormalOrder();

    }, [props.refreshDisplayArea])

    const getMessagesInReverseOrder = async () => {


        const res = await Axios.get(getUrlForMessagesInReverseOrder());

        let tempMessages = res.data?.messages?.map(message => message.messages).reverse() || [];

        console.log(tempMessages);

        setMessages(messages => [...tempMessages.concat(messages) || []]);

        for (let tempMessage of tempMessages) {
            if (unreadMessagesList.includes(tempMessage.messageId) === false) {
                markMessageAsRead(tempMessage);
                setUnreadMessagesList([...unreadMessagesList, tempMessage.messageId]);
            }
        }

        setScrollLock(false);
    }

    const getMessagesInNormalOrder = async () => {

        const res = await Axios.get(getUrlForMessagesInNormalOrder());

        let tempMessages = res.data?.messages?.map(message => message.messages) || [];

        setMessages(messages => [...messages, ...tempMessages]);

        for (let tempMessage of tempMessages) {
            if (tempMessage.messageStatus === 'UNREAD')
                markMessageAsRead(tempMessage);
        }

        props.setRefreshDisplayArea(false);

        setScrollLock(false);

    }

    useEffect(() => {

        messageDisplayAreaRef.current.scrollTop = messageDisplayAreaRef.current.scrollHeight;

    }, [messages[messages.length - 1]])

    const handleScroll = (e) => {

        if (e.target.scrollTop === 0 && scrollLock === false && messages.length > 0) {
            setScrollLock(true);
            setOffsetReverse(offsetReverse => offsetReverse + limitReverse);
            e.target.scrollTop += 180;
        }
    }

    const markMessageAsRead = async (message) => {

        if (message?.fromUser?.userType === 'ADMIN' || message?.fromUser?.userType === 'AGENT') {
            socket.emit('markMessageAsRead', { message, roomId: localStorage.getItem("token") });
        }
    }

    return (
        <div className="messages-display-area" ref={messageDisplayAreaRef} onScroll={handleScroll}>
            { messages.forEach(message => {

                if (message.fromUser.userType === 'ADMIN' || message.fromUser.userType === 'AGENT') {
                    return <ReceivedMessage message={message} />
                }

                if (message.fromUser.userType === 'CLIENT') {
                    return <SentMessage message={message} />
                }

            })}
        </div>
    );
}

export default MessagesDisplayArea;
import React, { useEffect, useRef, useState } from 'react';
import { backendUrl } from '../constants/constants';
import { axiosPrivate } from '../api/axios';
import useAuth from '../hooks/useAuth';
import SendIcon from '@mui/icons-material/Send';
import * as signalR from '@microsoft/signalr';
import ProfilePopup from './ProfilePopup';

type ChatMessage = {
  id: number;
  userId: number;
  username: string;
  content: string;
  timeSent: string;
};

type MessagesProps = {
  chatId: number;
  isCommunityChat: boolean;
};

const Messages: React.FC<MessagesProps> = ({ chatId, isCommunityChat }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [popupUserId, setPopupUserId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const { auth } = useAuth();

  const apiUrl = `${backendUrl}${isCommunityChat ? '/Community' : ''}/Chat`;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    axiosPrivate.get(`${apiUrl}/${chatId}/Messages`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data;
      })
      .then((data) => setMessages(data))
      .catch((err) => console.error('Error fetching messages:', err));

    var hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${backendUrl}/${isCommunityChat ? 'communityChatHub' : 'chatHub'}?chatId=${chatId}`, {
        accessTokenFactory: () => auth.token || ''
      }).build();
    hubConnection.on("ReceiveMessage", (message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    hubConnection.start();
    return () => {
      hubConnection.off("ReceiveMessage");
      hubConnection.stop()
        .catch(err => console.error('Error stopping SignalR connection:', err));
    };
  }, [chatId]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message === '') {
      return;
    }
    setMessage('');
    axiosPrivate.post(`${apiUrl}/${chatId}/Messages`, {
      chatId: chatId,
      senderId: auth.userId,
      content: message
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
      })
      .catch((err) => console.error('Error sending message:', err));
  }

  const handleUsernameClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, userId: number) => {
    const linkElement = event.currentTarget;
    const linkRect = linkElement.getBoundingClientRect();
    setPopupUserId(userId.toString());
    setPopupPosition({ x: linkRect.right + 10, y: linkRect.top });
  };

  const handleClosePopup = () => {
    setPopupUserId(null);
  };

  return (
    <div className="messagesContainer">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div className="flex items-center">
              <span
                className="text-gray-500 cursor-pointer mr-1"
                onClick={(e) => handleUsernameClick(e, message.userId)}
              >
                {message.username}
              </span>
              <span className="text-gray-500 text-xs mt-1">{new Date(message.timeSent).toLocaleTimeString()}</span>
            </div>
            <p className="message-content text-left break-words whitespace-normal">{message.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage}>
        <div>
          <input
            data-testid="messageBox"
            className="messageBox w-70 h-9 m-1 p-1 rounded-md border-2 text-lg outline-none bg-white"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message..."
          />
          <button data-testid="sendMessageButton" type="submit" className='sendMessageButton'>
            <SendIcon />
          </button>
        </div>
      </form>
      {popupUserId && (
        <ProfilePopup userId={popupUserId} onClose={handleClosePopup} position={popupPosition} />
      )}
    </div>
  );
};

export default Messages;
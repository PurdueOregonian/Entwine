import React, { useEffect, useState } from 'react';
import { backendUrl } from '../constants/constants';
import { axiosPrivate } from '../api/axios';
import useAuth from '../hooks/useAuth';
import SendIcon from '@mui/icons-material/Send';

type ChatMessage = {
  id: number;
  senderId: number;
  content: string;
  timeSent: string;
};

type MessagesProps = {
  chatId: number;
};

const Messages: React.FC<MessagesProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');

  const { auth } = useAuth();

  const apiUrl = `${backendUrl}/Chat`;

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
        return response.data;
      })
      .then((data) => {
        setMessages([...messages, data]);
      })
      .catch((err) => console.error('Error sending message:', err));
  }

  return (
    <div className="messages">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.senderId === auth.userId ? 'outgoing' : 'incoming'}`}>
          <p className="message-content">{message.content}</p>
          <span className="message-timestamp">{new Date(message.timeSent).toLocaleTimeString()}</span>
        </div>
      ))}
      <form onSubmit={sendMessage}>
        <div>
          <input
            data-testid="messageBox"
            className="messageBox"
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
    </div>
  );
};

export default Messages;
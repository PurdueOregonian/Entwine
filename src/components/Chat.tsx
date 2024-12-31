import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { backendUrl } from '../constants/constants';
import { axiosPrivate } from '../api/axios';

type ChatMessage = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

type User = {
  id: number;
  username: string;
};

type ChatProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const Chat: React.FC<ChatProps> = ({ isOpen, setIsOpen }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const apiUrl = `${backendUrl}/Chat`;

  useEffect(() => {
    axiosPrivate.get(`${apiUrl}/Users`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data;
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleUserClick = (username: string) => {
    setSelectedUser(username);
    axiosPrivate.get(`${apiUrl}/Messages/${username}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data;
      })
      .then((data) => setMessages(data))
      .catch((err) => console.error('Error fetching messages:', err));
  };

  return (
    <>
      {isOpen && <div className="chatOverlay">
        <div className="chat-selection">
          <h3>Chats</h3>
          {users.length === 0 ? (
            <p>No chats. Click "New Chat" to start a chat.</p>
          ) : (
            <ul>
              {users.map((user) => (
                <li
                  key={user.id}
                  className={`chat-user ${selectedUser === user.username ? 'selected' : ''}`}
                  onClick={() => handleUserClick(user.username)}
                >
                  {user.username}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="separator"></div>

        <div className="chat-contents">
          {selectedUser && (
            <>
              <h3>Chat with {selectedUser}</h3>
              <div className="messages">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.sender === selectedUser ? 'incoming' : 'outgoing'}`}>
                    <p className="message-content">{message.content}</p>
                    <span className="message-timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <CloseIcon
          className="closeChatButton"
          onClick={() => setIsOpen(false)}
        >
        </CloseIcon>
      </div>
      }
    </>
  );
};

export default Chat;
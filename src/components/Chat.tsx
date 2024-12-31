import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { backendUrl } from '../constants/constants';
import { axiosPrivate } from '../api/axios';
import SearchIcon from '@mui/icons-material/Search';
import { Tooltip } from '@mui/material';

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
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleAddUser = async (user: User) => {
    try {
      await axiosPrivate.post(`${apiUrl}/AddUser`, { user });
      setUsers([...users, user]);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const searchUsers = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosPrivate.get(`${backendUrl}/Search?searchString=${searchQuery}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data;
      })
      .then((data) => setSearchResults(data))
      .catch((err) => console.error('Error fetching search results:', err
      ));
  }

  return (
    <>
      {isOpen && <div className="chatOverlay">
        <div className="chat-selection">
          <h3>Chats</h3>
          {users.length === 0 ? (
            <p>No chats. Click "New Chat" to start a chat.</p>
          ) : (
            <ul className="userList">
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
          <Tooltip title="New Chat">
            <AddCommentIcon
              className="topRightButton muiClickableButton"
              onClick={() => setShowSearch(true)}
            />
          </Tooltip>
        </div>

        <div className="separator"></div>

        <div className="chat-contents">
          {showSearch && (
            <div className="search-bar">
              <form onSubmit={searchUsers}>
                <div className="searchContainer">
                  <input
                    className="searchInput"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                  />
                  <Tooltip title="Search">
                    <button type="submit" className='searchButton'>
                      <SearchIcon />
                    </button>
                  </Tooltip>
                </div>
              </form>
              <ul className="userList">
                {searchResults.map((result) => (
                  <li key={result.id} onClick={() => handleAddUser(result)}>
                    {result.username}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
        <Tooltip title="Close">
          <CloseIcon
            className="topRightButton muiClickableButton"
            onClick={() => setIsOpen(false)}
          >
          </CloseIcon>
        </Tooltip>
      </div>
      }
    </>
  );
};

export default Chat;
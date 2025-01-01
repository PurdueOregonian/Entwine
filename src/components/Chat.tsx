import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { backendUrl } from '../constants/constants';
import { axiosPrivate } from '../api/axios';
import SearchIcon from '@mui/icons-material/Search';
import { Tooltip } from '@mui/material';
import useAuth from '../hooks/useAuth';

type ChatData = {
  id: number;
  usernames: string[];
}

type ChatMessage = {
  id: number;
  senderId: number;
  content: string;
  timeSent: string;
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
  const [chats, setChats] = useState<ChatData[]>([]);
  const [selectedChatIndex, setSelectedChatIndex] = useState<number>(-1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { auth } = useAuth();

  const apiUrl = `${backendUrl}/Chat`;

  useEffect(() => {
    axiosPrivate.get(`${apiUrl}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data;
      })
      .then((data) => setChats(data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleChatClick = (chatIndex: number) => {
    setShowSearch(false);
    setSelectedChatIndex(chatIndex);
    axiosPrivate.get(`${apiUrl}/${chats[chatIndex].id}/Messages`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data;
      })
      .then((data) => setMessages(data))
      .catch((err) => console.error('Error fetching messages:', err));
  };

  const handleAddChat = async (user: User) => {
    // Not handling chats with more than 2 users yet
    try {
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
      axiosPrivate.post(apiUrl, { userIds: [user.id] })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Network response was not ok');
          }
          return response.data;
        })
        .then((data) => {
          var chatId = data.id;
          setChats([...chats, {id: chatId, usernames: [user.username]}]);
          setSelectedChatIndex(chats.length);
          setMessages([]);
        })
        .catch((err) => console.error('Error adding chat:', err));
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
  
  const newChatClicked = () => {
    setShowSearch(true);
    setSelectedChatIndex(-1);
  }

  return (
    <>
      {isOpen && <div className="chatOverlay">
        <div className="chat-selection">
          <h3>Chats</h3>
          {chats.length === 0 ? (
            <p>No chats. Click "New Chat" to start a chat.</p>
          ) : (
            <ul className="chatList">
              {chats.map((chat, index) => (
                <li
                  key={chat.id}
                  className={`chat-user ${selectedChatIndex === index ? 'selected' : ''}`}
                  onClick={() => handleChatClick(index)}
                >
                  {chat.usernames.join(', ')}
                </li>
              ))}
            </ul>
          )}
          <Tooltip title="New Chat">
            <AddCommentIcon
              className="topRightButton muiClickableButton"
              onClick={() => {newChatClicked()}}
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
              <ul className="chatList">
                {searchResults.map((result) => (
                  <li key={result.id} onClick={() => handleAddChat(result)}>
                    {result.username}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedChatIndex !== -1 && (
            <>
              <h3>Chat with {chats[selectedChatIndex].usernames.join(', ')}</h3>
              <div className="messages">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.senderId === auth.userId ? 'outgoing' : 'incoming'}`}>
                    <p className="message-content">{message.content}</p>
                    <span className="message-timestamp">{new Date(message.timeSent).toLocaleTimeString()}</span>
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
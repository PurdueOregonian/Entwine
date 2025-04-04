import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { axiosPrivate } from '../api/axios';
import SearchIcon from '@mui/icons-material/Search';
import { Tooltip } from '@mui/material';
import Messages from './Messages';
import { User } from '../types/User';

type ChatData = {
  id: number;
  usernames: string[];
};

type ChatProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const Chat: React.FC<ChatProps> = ({ isOpen, setIsOpen }) => {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [selectedChatIndex, setSelectedChatIndex] = useState<number>(-1);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const apiUrl = '/Chat';

  useEffect(() => {
    axiosPrivate.get(`${apiUrl}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data;
      })
      .then((data) => {
        setChats(data);
        setLoading(false);
      })
      .catch((err) => console.error('Error fetching chats for user:', err));
  }, []);

  const handleChatClick = (chatIndex: number) => {
    setShowSearch(false);
    setSelectedChatIndex(chatIndex);
  };

  const handleAddChat = async (user: User) => {
    // Not handling chats with more than 2 users yet
    try {
      const index = chats.findIndex(chat => chat.usernames.includes(user.username));
      if (index !== -1) {
        setSelectedChatIndex(index);
      }
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
          setChats([...chats, { id: chatId, usernames: [user.username] }]);
          setSelectedChatIndex(chats.length);
        })
        .catch((err) => console.error('Error adding chat:', err));
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const searchUsers = () => {
    axiosPrivate.get(`/Search/Users/Username?searchString=${searchQuery}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data;
      })
      .then((data) => setSearchResults(data))
      .catch((err) => console.error('Error fetching search results:', err
      ));
  };

  const newChatClicked = () => {
    setShowSearch(true);
    setSelectedChatIndex(-1);
  }

  return (
    <>
      {isOpen && <div className="chatOverlay">
        <div className="chat-selection p-5 w-[30%]">
          <div className='text-xl font-semibold m-2'>Chats</div>
          {loading ? (
            <p>Loading...</p> // Display loading message
          ) : (
            <>
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
                  data-testid="newChat"
                  className="topRightButton muiClickableButton"
                  onClick={() => { newChatClicked() }}
                />
              </Tooltip>
            </>
          )}
        </div>

        <div className="separator"></div>

        <div className="chat-contents">
          {showSearch && (
            <div className="search-bar">
              <div className="searchContainer">
                <input
                  data-testid="searchInput"
                  className="w-70 h-9 m-1 p-1 pr-9 rounded-md border-2 text-lg"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchUsers();
                    }
                  }}
                  placeholder="Search users..."
                />
                <Tooltip title="Search">
                  <button onClick={() => searchUsers()} data-testid="searchButton" className='searchButton'>
                    <SearchIcon />
                  </button>
                </Tooltip>
              </div>
              <ul className="chatList">
                {searchResults.map((result) => (
                  <li data-testid={`user-search-result-${result.username}`} key={result.id} onClick={() => handleAddChat(result)}>
                    {result.username}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedChatIndex !== -1 && (
            <>
              <h3>Chat with {chats[selectedChatIndex].usernames.join(', ')}</h3>
              <Messages
                chatId={chats[selectedChatIndex].id}
                isCommunityChat={false}
              />
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
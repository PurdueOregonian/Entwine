import React, { useState } from 'react';
import Messages from './Messages';
import { CommunityChatData } from '../types/CommunityChatData';

type CommunityChatProps = {
  chats: CommunityChatData[];
};

const CommunityChat: React.FC<CommunityChatProps> = ({ chats }) => {
  const [selectedChatIndex, setSelectedChatIndex] = useState<number>(-1);

  const handleChatClick = (chatIndex: number) => {
    setSelectedChatIndex(chatIndex);
  };

  return (
    <div className='communityChat'>
      <div className="chat-selection">
        <h3>Chats</h3>
        <>
          <ul className="chatList">
            {chats.map((chat, index) => (
              <li
                key={chat.id}
                className={`community-chat ${selectedChatIndex === index ? 'selected' : ''}`}
                onClick={() => handleChatClick(index)}
              >
                {chat.name}
              </li>
            ))}
          </ul>
        </>
      </div>

      <div className="separator"></div>

      <div className="chat-contents">
        {selectedChatIndex !== -1 && (
          <>
            <h3>{chats[selectedChatIndex].name}</h3>
            <Messages
              chatId={chats[selectedChatIndex].id}
              isCommunityChat={true}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityChat;
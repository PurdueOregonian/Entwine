import React, { useEffect, useState } from 'react';
import Messages from './Messages';
import { CommunityChatData } from '../types/CommunityChatData';
import { axiosPrivate } from '../api/axios';
import axios from "axios";
import { RetrievedCommunityData } from '../types/RetrievedCommunityData';
import { Box, Modal, Typography } from '@mui/material';
import EventCalendar from './EventCalendar';

const Community: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChatIndex, setSelectedChatIndex] = useState<number>(-1);
  const [chats, setChats] = useState<CommunityChatData[]>([]);
  const [isEventCalendarOpen, setIsEventCalendarOpen] = useState(false);
  useEffect(() => {
      const apiUrl = '/Community';

      axiosPrivate.get(apiUrl, {
          withCredentials: true,
          headers: {
              'Content-Type': 'application/json'
          }
      })
          .then(response => {
              if (response.status !== 200) {
                  throw new Error('Network response was not ok');
              }
              return response.data;
          })
          .then((data: RetrievedCommunityData) => {
              setLoading(false);
              setChats(data.chats);
          })
          .catch(error => {
              setLoading(false);
              if (error.status === 404) {
                  setError('No community chat available. Please set a location in your profile.');
              }
              if (axios.isAxiosError(error)) {
                  console.error('Error:', error.message);
              }
          });
  }, [])

  const handleChatClick = (chatIndex: number) => {
    setSelectedChatIndex(chatIndex);
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className='communityChat'>
      <div className="chat-selection p-5 w-[20%]">
        <button
          className="button"
          onClick={() => setIsEventCalendarOpen(true)}>
            Events
        </button>
        <Modal
            open={isEventCalendarOpen}
            onClose={() => setIsEventCalendarOpen(false)}
            aria-labelledby="event-calendar-modal"
            aria-describedby="event-calendar-modal-description"
        >
            <EventCalendar
                onClose={() => setIsEventCalendarOpen(false)}
            />
        </Modal>
        <div className='text-2xl font-semibold m-2'>Chats</div>
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

export default Community;
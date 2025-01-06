import { fireEvent, render, screen } from '@testing-library/react';
import { backendUrl } from '../src/constants/constants';
import { MemoryRouter as Router } from "react-router-dom";
import { axiosPrivate } from '../src/api/axios';
import Chat from '../src/components/Chat';
import useAuth from '../src/hooks/useAuth';
import MockHubConnection from '../testUtils/mockhubconnection';

const mockHubConnection = new MockHubConnection();
jest.mock('../src/api/axios');
jest.mock('../src/hooks/useAuth', () => ({
    __esModule: true,
    default: jest.fn()
}));
jest.mock('@microsoft/signalr', () => {
    const originalModule = jest.requireActual('@microsoft/signalr');
    return {
      ...originalModule,
      HubConnectionBuilder: jest.fn().mockImplementation(() => ({
        withUrl: jest.fn().mockReturnThis(),
        build: jest.fn().mockReturnValue(mockHubConnection)
      }))
    };
  });
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Search page', () => {
    beforeAll(() => {
        (axiosPrivate.get as jest.Mock).mockImplementation((url) => {
            if (url === `${backendUrl}/Chat`) {
                return Promise.resolve({
                    data: [
                        { id: 1, usernames: ['JohnDoe'] },
                        { id: 2, usernames: ['JaneDoe'] }
                    ],
                    status: 200
                });
            } else if (url === `${backendUrl}/Chat/1/Messages`) {
                return Promise.resolve({
                    data: [
                        { id: 1, senderId: 1, content: 'Hello', timeSent: '2023-01-01T00:00:00Z' },
                        { id: 2, senderId: 2, content: 'Hi', timeSent: '2023-01-01T00:01:00Z' }
                    ],
                    status: 200
                });
            } else if (url === `${backendUrl}/Search?searchString=SomeOtherUser`) {
                return Promise.resolve({
                    data: [
                        { id: 4, username: 'SomeOtherUser' }
                    ],
                    status: 200
                });
            } else {
                return Promise.reject(new Error('Unknown endpoint'));
            }
        });
        (axiosPrivate.post as jest.Mock).mockImplementation((url) => {
            if (url === `${backendUrl}/Chat`) {
                return Promise.resolve({
                    data: {
                        id: 3,
                        userIds: [1, 4]
                    },
                    status: 200
                });
            } else if (url === `${backendUrl}/Chat/1/Messages`) {
                const newMessage = { id: 3, senderId: 1, content: 'SomeMessage', timeSent: '2023-01-01T00:00:00Z' };
                mockHubConnection.simulateMessage('ReceiveMessage', newMessage);
                return Promise.resolve({
                    data: {
                        id: 3,
                        senderId: 1,
                        content: 'SomeMessage',
                        timeSent: '2023-01-01T00:00:00Z'
                    },
                    status: 200
                });
            } else {
                return Promise.reject(new Error('Unknown endpoint'));
            }
        });
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true
            })
        ) as jest.Mock;

        (useAuth as jest.Mock).mockReturnValue({
            auth: {
                userId: 1,
                token: 'mock-token'
            }
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        render(<Router>
            <Chat
                isOpen={true}
                setIsOpen={() => { }}
            />
        </Router>
        );
    })

    test('can view already existing chats', async () => {
        const chat1 = await screen.findByText('JohnDoe');
        fireEvent.click(chat1);

        await screen.findByText('Hello');
        screen.getByText('Hi');
    })

    test('can send a message', async () => {
        const chat1 = await screen.findByText('JohnDoe');
        fireEvent.click(chat1);

        const messageBox = await screen.findByTestId('messageBox');
        fireEvent.change(messageBox, { target: { value: 'SomeMessage' } });
        fireEvent.blur(messageBox);

        const sendMessageButton = screen.getByTestId('sendMessageButton');
        fireEvent.click(sendMessageButton);

        await screen.findByText('SomeMessage');
        const messageBoxAfter = screen.getByTestId('messageBox') as HTMLInputElement;
        expect(messageBoxAfter.value).toBe('');
    })

    test('can add a new chat', async () => {
        // Wait for chats to load. New chat button should not appear before that
        await screen.findByText('JohnDoe');

        const newChatButton = screen.getByTestId('newChat');
        fireEvent.click(newChatButton);

        expect(screen.queryByTestId('messageBox')).toBeNull();

        const searchBar = screen.getByTestId('searchInput');
        fireEvent.change(searchBar, { target: { value: 'SomeOtherUser' } });
        fireEvent.blur(searchBar);

        const searchButton = screen.getByTestId('searchButton');
        fireEvent.click(searchButton);

        const searchResult = await screen.findByText('SomeOtherUser');
        fireEvent.click(searchResult);
        
        expect(screen.queryByTestId('searchInput')).toBeNull();
        expect(screen.queryByTestId('searchButton')).toBeNull();

        await screen.findByTestId('messageBox');
    })
})
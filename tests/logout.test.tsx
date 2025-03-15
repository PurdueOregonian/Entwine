import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axiosPrivate } from '../src/api/axios';
import LogoutButton from '../src/Auth/LogoutButton';
import { MemoryRouter as Router } from 'react-router-dom';

jest.mock('../src/api/axios');
jest.useFakeTimers();

describe('Logout button', () => {
    beforeAll(() => {
        (axiosPrivate.post as jest.Mock).mockResolvedValue({ data: { status: 200 } });
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true
            })
        ) as jest.Mock;
    });

    beforeEach(async () => {
        jest.clearAllMocks();

        render(<Router>
            <LogoutButton />
        </Router>);
    })

    test('logouts', async () => {
        const logoutButton = await screen.findByTestId('logoutButton');
        fireEvent.click(logoutButton);
        
        await waitFor(() => {
            expect(axiosPrivate.post).toHaveBeenCalledWith('/Auth/Logout',
                {},
                {
                    "withCredentials": true
                });
        });
    })
})
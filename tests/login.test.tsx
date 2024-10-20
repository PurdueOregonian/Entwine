import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { backendUrl } from '../src/constants/constants';
import { MemoryRouter as Router } from "react-router-dom";
import axios from '../src/api/axios';
import Login from '../src/Login';

jest.mock('../src/api/axios');

describe('Login component', () => {
    beforeAll(() => {
        (axios.post as jest.Mock).mockResolvedValue({ data: {} });
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true
            })
        ) as jest.Mock;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        render(<Router>
            <Login />
        </Router>
        );
    })

    test('renders the Login component', async () => {
        const usernameInput = screen.getByTestId('loginUsernameInput');
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        const passwordInput = screen.getByTestId('loginPasswordInput');
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
        const registerSubmit = screen.getByTestId('loginSubmit');
        fireEvent.click(registerSubmit);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(`${backendUrl}/Auth/Login`,
                JSON.stringify({
                    Username: 'testuser',
                    Password: 'testpassword'
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    "withCredentials": true
                });
        });
    })
})
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../src/Register';
import { backendUrl } from '../src/constants/constants';
import { MemoryRouter as Router } from "react-router-dom";
import axios from '../src/api/axios';

jest.mock('../src/api/axios');

describe('Register component', () => {
    beforeAll(() => {
        (axios.post as jest.Mock).mockResolvedValue({ data: {} });
    });

    test('renders the Register component', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true
            })
        ) as jest.Mock;

        render(<Router>
            <Register />
        </Router>
        );

        const usernameInput = screen.getByTestId('registerUsernameInput');
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        const passwordInput = screen.getByTestId('registerPasswordInput');
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
        const registerSubmit = screen.getByTestId('registerSubmit');
        fireEvent.click(registerSubmit);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(`${backendUrl}/Auth/Register`,
                JSON.stringify({
                    Username: 'testuser',
                    Password: 'testpassword'
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        });
    })
})
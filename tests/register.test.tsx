import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Register from '../src/Auth/Register';
import { MemoryRouter as Router } from "react-router-dom";
import axios from '../src/api/axios';

jest.mock('../src/api/axios');

describe('Register component', () => {
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
            <Register />
        </Router>
        );
    })

    test('renders the Register component', async () => {
        const usernameInput = screen.getByTestId('registerUsernameInput');
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        const passwordInput = screen.getByTestId('registerPasswordInput');
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
        const passwordConfirmInput = screen.getByTestId('registerConfirmPasswordInput');
        fireEvent.change(passwordConfirmInput, { target: { value: 'testpassword' } });
        const registerSubmit = screen.getByTestId('registerSubmit');
        fireEvent.click(registerSubmit);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/Auth/Register',
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

    test('does not register if passwords do not match', async () => {
        const usernameInput = screen.getByTestId('registerUsernameInput');
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        const passwordInput = screen.getByTestId('registerPasswordInput');
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
        const passwordConfirmInput = screen.getByTestId('registerConfirmPasswordInput');
        fireEvent.change(passwordConfirmInput, { target: { value: 'nottestpassword' } });
        const registerSubmit = screen.getByTestId('registerSubmit');
        await act(async () => fireEvent.click(registerSubmit));

        screen.getByText('Passwords do not match');
        expect(axios.post).not.toHaveBeenCalled();
    })
})
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../src/Register';

describe('Register component', () => 
    test('renders the Register component', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true
            })
        ) as jest.Mock;

        render(<Register />);

        const usernameInput = screen.getByTestId('registerUsernameInput');
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        const passwordInput = screen.getByTestId('registerPasswordInput');
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
        const registerSubmit = screen.getByTestId('registerSubmit');
        fireEvent.click(registerSubmit);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('https://localhost:7253/Auth/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Username: 'testuser',
                    Password: 'testpassword'
                }),
            });
        });
    })
)
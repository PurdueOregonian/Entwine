import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../src/Register';

describe('Register component', () => 
    test('renders the Register component', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true
            })
        ) as jest.Mock;

        const mockSetDisplayModal = jest.fn();
        render(<Register
            setDisplayModal={mockSetDisplayModal}
        />);

        const usernameInput = screen.getByTestId('registerUsernameInput');
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        const passwordInput = screen.getByTestId('registerPasswordInput');
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
        const registerSubmit = screen.getByTestId('registerSubmit');
        fireEvent.click(registerSubmit);

        expect(global.fetch).toHaveBeenCalledWith('https://localhost:7253/Auth/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Username: 'testuser',
                Password: 'testpassword'
            }),
        });
    })
)
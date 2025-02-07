import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { backendUrl } from '../src/constants/constants';
import { MemoryRouter as Router } from "react-router-dom";
import { axiosPrivate } from '../src/api/axios';
import Search from '../src/pages/Search';

jest.mock('../src/api/axios');

describe('Search page', () => {
    beforeAll(() => {
        (axiosPrivate.post as jest.Mock).mockResolvedValue({
            data: [
                { username: 'Jan Doe', dateOfBirth: '1995-01-02', gender: 'Other' },
                { username: 'Jane Doe', dateOfBirth: '1996-02-07', gender: 'Female' }
            ],
            status: 200
        });
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true
            })
        ) as jest.Mock;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        render(<Router>
            <Search />
        </Router>
        );
    })

    test('can search for profiles', async () => {
        const minAge = screen.getByTestId('minField');
        fireEvent.change(minAge, { target: { value: '23' } });
        fireEvent.blur(minAge);
        const maxAge = screen.getByTestId('maxField');
        fireEvent.change(maxAge, { target: { value: '84' } });
        fireEvent.blur(maxAge);
        const female = screen.getByTestId('multipleRectangleSelector-Female');
        fireEvent.click(female);
        const other = screen.getByTestId('multipleRectangleSelector-Other');
        fireEvent.click(other);
        const searchButton = screen.getByTestId('searchProfiles');
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(axiosPrivate.post).toHaveBeenCalledWith(`${backendUrl}/Search/Users/Profile`,
                JSON.stringify({
                    MinAge: 23,
                    MaxAge: 84,
                    Gender: ["Female", "Other"]
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    "withCredentials": true
                });
        });

        await screen.findByText('Jan Doe');
        screen.getByText('Jane Doe');
    })
})
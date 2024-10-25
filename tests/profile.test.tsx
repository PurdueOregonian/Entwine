import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { backendUrl } from '../src/constants/constants';
import { MemoryRouter as Router } from "react-router-dom";
import Profile from '../src/Profile';
import { axiosPrivate } from '../src/api/axios';

jest.mock('../src/api/axios');

describe('Profile component', () => {
    beforeAll(() => {
        (axiosPrivate.post as jest.Mock).mockResolvedValue({ data: {} });
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true
            })
        ) as jest.Mock;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        render(<Router>
            <Profile />
        </Router>
        );
    })

    test('submits profile', async () => {
        const monthInput = screen.getByTestId('month');
        fireEvent.change(monthInput, { target: { value: '07' } });
        const dayInput = screen.getByTestId('day');
        fireEvent.change(dayInput, { target: { value: '22' } });
        const yearInput = screen.getByTestId('year');
        fireEvent.change(yearInput, { target: { value: '2002' } });
        const female = screen.getByTestId('rectangleSelector-Female');
        fireEvent.click(female);

        const saveProfile = screen.getByTestId('saveProfile');
        fireEvent.click(saveProfile);

        await waitFor(() => {
            expect(axiosPrivate.post).toHaveBeenCalledWith(`${backendUrl}/Profile/Save`,
                JSON.stringify({
                    DateOfBirth: `2002-07-22`,
                    Gender: 'Female'
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
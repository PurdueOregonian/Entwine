import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { backendUrl } from '../src/constants/constants';
import { MemoryRouter as Router } from "react-router-dom";
import Profile from '../src/pages/Profile';
import { axiosPrivate } from '../src/api/axios';

jest.mock('../src/api/axios');

describe('Profile component', () => {
    beforeAll(() => {
        (axiosPrivate.get as jest.Mock).mockResolvedValue({ status: 200, data: {
            dateOfBirth: '2002-10-04',
            gender: 'Male'
        } });
        (axiosPrivate.post as jest.Mock).mockResolvedValue({ data: { status: 200 } });
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true
            })
        ) as jest.Mock;
    });

    beforeEach(async () => {
        jest.clearAllMocks();

        // necessary to wrap in act because on load, we get the profile data and rerender
        await act(async () => {
            render(<Router>
                <Profile />
            </Router>);
        });
    })

    test('submits profile', async () => {
        const monthInput = await screen.findByTestId('month');
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
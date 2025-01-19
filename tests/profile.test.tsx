import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { backendUrl } from '../src/constants/constants';
import { MemoryRouter as Router } from "react-router-dom";
import Profile from '../src/pages/Profile';
import { axiosPrivate } from '../src/api/axios';
import useStaticData from '../src/hooks/useStaticData';

jest.mock('../src/api/axios');
jest.useFakeTimers();
jest.mock('../src/hooks/useStaticData');

const mockUseStaticData = useStaticData as jest.MockedFunction<typeof useStaticData>;

describe('Profile page', () => {
    beforeAll(() => {
        mockUseStaticData.mockReturnValue({
            interestMap: new Map([
              [1, { id: 1, name: 'Interest 1', categories: [1] }],
              [2, { id: 2, name: 'Interest 2', categories: [2] }],
              [3, { id: 3, name: 'Interest 3', categories: [1] }],
              [4, { id: 4, name: 'Interest 4', categories: [1, 2] }]
            ]),
            interestCategoryMap: new Map([
              [1, { id: 1, name: 'Category 1' }],
              [2, { id: 2, name: 'Category 2' }]
            ]),
          });
          (axiosPrivate.get as jest.Mock).mockImplementation((url) => {
            if (url === `${backendUrl}/Profile`) {
                return Promise.resolve({
                    data: {
                        dateOfBirth: '2002-10-04',
                        gender: 'Male',
                        interests: [3],
                        location: {
                            city: 'City',
                            state: 'State',
                            country: 'Country'
                        }
                    },
                    status: 200
                });
            } else if (url.startsWith(`${backendUrl}/Location`)) {
                return Promise.resolve({
                    data: {
                        city: 'NewCity',
                        state: 'NewState',
                        country: 'NewCountry'
                    },
                    status: 200
                });
            } else {
                return Promise.reject(new Error('Unknown endpoint'));
            }
        });
        Object.defineProperty(global.navigator, 'geolocation', {
            value: {
              getCurrentPosition: jest.fn().mockImplementation((success) => {
                success({
                  coords: {
                    latitude: 40.7128,
                    longitude: -74.0060
                  }
                });
              })
            },
            writable: true
          });
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
        const profileModeButton = await screen.findByTestId('profileModeButton');
        fireEvent.click(profileModeButton);

        const monthInput = await screen.findByTestId('month');
        fireEvent.change(monthInput, { target: { value: '07' } });
        const dayInput = screen.getByTestId('day');
        fireEvent.change(dayInput, { target: { value: '22' } });
        const yearInput = screen.getByTestId('year');
        fireEvent.change(yearInput, { target: { value: '2002' } });
        const female = screen.getByTestId('rectangleSelector-Female');
        fireEvent.click(female);
        const editInterestsButton = screen.getByTestId('editInterestsButton');
        fireEvent.click(editInterestsButton);
        const interestChip1 = screen.getByTestId('interestChip-1');
        fireEvent.click(interestChip1);
        const interestChip4s = screen.getAllByTestId('interestChip-4');
        expect(interestChip4s.length).toEqual(2);
        fireEvent.click(interestChip4s[1]);
        const closeEditInterests = screen.getByTestId('closeEditInterests');
        fireEvent.click(closeEditInterests);
        const updateLocationButton = screen.getByTestId('updateLocation');
        fireEvent.click(updateLocationButton);
        await screen.findByText('NewCity, NewState');

        const saveProfile = screen.getByTestId('saveProfile');
        await act(async () => fireEvent.click(saveProfile));

        screen.getByText('Successfully saved!');

        await waitFor(() => {
            expect(axiosPrivate.post).toHaveBeenCalled();
        });

        const [url, data, config] = (axiosPrivate.post as jest.Mock).mock.calls[0];
        expect(url).toBe(`${backendUrl}/Profile/Save`);

        const parsedData = JSON.parse(data);
        expect(parsedData).toEqual(expect.objectContaining({
            DateOfBirth: '2002-07-22',
            Gender: 'Female',
            Interests: expect.arrayContaining([1, 3, 4]),
            Location: {
                city: 'NewCity',
                state: 'NewState',
                country: 'NewCountry'
            }
        }));

        expect(config).toEqual(expect.objectContaining({
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }));

        //TODO fix. Bad because it relies on the implementation of ColoredMessage. But better than nothing.
        //Tests that the message vanishes eventually.
        await act(async () => jest.runAllTimers());
        await act(async () => jest.runAllTimers());
        expect((screen.queryAllByText('Successfully saved!')).length).toEqual(0);
    })
})
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import useAuth from '../src/hooks/useAuth';
import useRefreshToken from '../src/hooks/useRefreshToken';
import PersistLogin from '../src/Auth/PersistLogin';

jest.mock('../src/hooks/useAuth');
jest.mock('../src/hooks/useRefreshToken');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRefreshToken = useRefreshToken as jest.MockedFunction<typeof useRefreshToken>;
const mockRefresh = jest.fn();

describe('PersistLogin', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseRefreshToken.mockReturnValue(mockRefresh);
    });

    it('renders the Outlet when persist is false', () => {
        mockUseAuth.mockReturnValue({ auth: {}, setAuth: () => {}, persist: false, setPersist: () => {} });

        render(
            <MemoryRouter>
                <Routes>
                    <Route element={<PersistLogin />}>
                        <Route path="*" element={<div data-testid='test'>Test</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        screen.getByTestId('test');
        expect((screen.queryAllByTestId('loading')).length).toEqual(0);
        expect(mockRefresh).not.toHaveBeenCalled();
    });

    it('renders Loading... when persist is true, then calls refresh', async () => {
        mockUseAuth.mockReturnValue({ auth: {}, setAuth: () => {}, persist: true, setPersist: () => {} });

        render(
            <MemoryRouter>
                <Routes>
                    <Route element={<PersistLogin />}>
                        <Route path="*" element={<div data-testid='test'>Test</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        screen.getByTestId('loading');
        expect((screen.queryAllByTestId('test')).length).toEqual(0);
        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
        });
        expect((screen.queryAllByTestId('loading')).length).toEqual(0);
    });
});
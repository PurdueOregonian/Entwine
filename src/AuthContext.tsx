import React, { createContext, useContext, useState, ReactNode } from 'react';

const AuthContext = createContext({
    isAuthenticated: false,
    login: (_: string) => { },
    logout: () => { }
});
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (token: string) => {
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
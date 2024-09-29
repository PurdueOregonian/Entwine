import React, { createContext, useState, ReactNode } from 'react';

interface Auth {
    username?: string;
    password?: string;
    token?: string;
}
interface AuthContextType {
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}

const AuthContext = createContext<AuthContextType>({
    auth: {},
    setAuth: () => { }
});
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<Auth>({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
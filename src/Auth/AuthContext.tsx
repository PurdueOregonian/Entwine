import React, { createContext, useState, ReactNode } from 'react';

interface Auth {
    username?: string;
    password?: string;
    token?: string;
    userId?: number;
}
interface AuthContextType {
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;
    persist: boolean;
    setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType>({
    auth: {},
    setAuth: () => { },
    persist: false,
    setPersist: () => { }
});
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const persistItem = localStorage.getItem("persist");
    const [auth, setAuth] = useState<Auth>({});
    const [persist, setPersist] = useState(persistItem ? JSON.parse(persistItem) : false);

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth?.token && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => {
            isMounted = false;
        }
    }, [])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p data-testid='loading'>Loading...</p>
                        : <Outlet />
                }
        </>
    )
}

export default PersistLogin;
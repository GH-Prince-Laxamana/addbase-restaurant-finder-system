
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import type { User } from "../types/api";

import {
    getCurrentUser,
    loginAdmin as loginAdminService,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
} from "../services/auth.service";

import {
    setApiAccessToken,
    setApiAccessTokenListener,
    setAuthExpiredHandler,
} from "../services/api";
import { AuthContext } from "./auth-context";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] =
        useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setApiAccessTokenListener(setAccessToken);

        setAuthExpiredHandler(() => {
            setUser(null);
        });

        return () => {
            setApiAccessTokenListener(null);
            setAuthExpiredHandler(null);
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function restoreSession() {
            try {
                const { accessToken: newAccessToken } =
                    await refreshAccessToken();

                if (cancelled) {
                    return;
                }

                // Set the token before making the /auth/me request.
                setApiAccessToken(newAccessToken);

                const { user: currentUser } =
                    await getCurrentUser();

                if (cancelled) {
                    return;
                }

                setAccessToken(newAccessToken);
                setUser(currentUser);
            } catch {
                if (cancelled) {
                    return;
                }

                setApiAccessToken(null);
                setAccessToken(null);
                setUser(null);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void restoreSession();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback(
        async (email: string, password: string) => {
            const response = await loginUser({
                email,
                password,
            });

            setApiAccessToken(response.accessToken);
            setAccessToken(response.accessToken);
            setUser(response.user);
        },
        []
    );

    const adminLogin = useCallback(
        async (email: string, password: string) => {
            const response = await loginAdminService({
                email,
                password,
            });

            setApiAccessToken(response.accessToken);
            setAccessToken(response.accessToken);
            setUser(response.user);
        },
        []
    );

    const register = useCallback(
        async (
            name: string,
            email: string,
            password: string
        ) => {
            await registerUser({
                name,
                email,
                password,
            });
        },
        []
    );

    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } finally {
            setApiAccessToken(null);
            setAccessToken(null);
            setUser(null);
        }
    }, []);

    const value = useMemo(
        () => ({
            user,
            accessToken,
            isLoading,
            isAuthenticated: user !== null,
            login,
            adminLogin,
            register,
            logout,
        }),
        [
            user,
            accessToken,
            isLoading,
            login,
            adminLogin,
            register,
            logout,
        ]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
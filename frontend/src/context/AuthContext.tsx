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
    loginAdmin,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
} from "../services/auth.service";
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
        let cancelled = false;

        async function restoreSession() {
            try {
                const { accessToken: newAccessToken } =
                    await refreshAccessToken();

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

                setAccessToken(null);
                setUser(null);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        restoreSession();

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

            setAccessToken(response.accessToken);
            setUser(response.user);
        },
        []
    );

    const adminLogin = useCallback(
        async (email: string, password: string) => {
            const response = await loginAdmin({
                email,
                password,
            });

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
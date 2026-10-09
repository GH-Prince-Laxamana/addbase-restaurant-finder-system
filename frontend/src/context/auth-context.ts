
import { createContext } from "react";
import type { User } from "../types/api";

export interface AuthContextValue {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    adminLogin: (
        email: string,
        password: string
    ) => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext =
    createContext<AuthContextValue | undefined>(
        undefined
    );
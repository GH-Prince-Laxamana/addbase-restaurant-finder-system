import { api } from "./api";
import type {
    AuthResponse,
    RefreshResponse,
    RegisterResponse,
} from "../types/auth";
import type { MeResponse } from "../types/api";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

export function registerUser(input: RegisterInput) {
    return api.post<RegisterResponse>(
        "/auth/register",
        input
    );
}

export function loginUser(input: LoginInput) {
    return api.post<AuthResponse>(
        "/auth/login",
        input
    );
}

export function loginAdmin(input: LoginInput) {
    return api.post<AuthResponse>(
        "/auth/admin/login",
        input
    );
}

let refreshPromise: Promise<RefreshResponse> | null = null;

export function refreshAccessToken(): Promise<RefreshResponse> {
    if (!refreshPromise) {
        refreshPromise = api.post<RefreshResponse>(
            "/auth/refresh"
        );
    }

    const currentPromise = refreshPromise;

    return currentPromise.finally(() => {
        if (refreshPromise === currentPromise) {
            refreshPromise = null;
        }
    });
}

export function logoutUser() {
    return api.post<void>("/auth/logout");
}

export function getCurrentUser() {
    return api.get<MeResponse>("/auth/me");
}
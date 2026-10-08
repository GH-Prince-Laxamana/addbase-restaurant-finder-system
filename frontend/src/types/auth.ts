import type { User } from "./api";

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface RefreshResponse {
    accessToken: string;
}

export interface RegisterResponse {
    user: User;
}
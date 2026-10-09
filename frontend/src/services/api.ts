
const API_BASE_URL = "/api/v1";

let accessToken: string | null = null;

export function setApiAccessToken(token: string | null) {
    accessToken = token;
}

interface ApiErrorResponse {
    error?: {
        code?: string;
        message?: string;
        details?: Record<string, string>;
    };
}

export class ApiError extends Error {
    code: string;
    status: number;
    details?: Record<string, string>;

    constructor(
        status: number,
        code: string,
        message: string,
        details?: Record<string, string>
    ) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const data =
            (await response.json().catch(() => null)) as
                | ApiErrorResponse
                | null;

        throw new ApiError(
            response.status,
            data?.error?.code || "API_ERROR",
            data?.error?.message || "Request failed.",
            data?.error?.details
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export const api = {
    get<T>(path: string) {
        return request<T>(path);
    },

    post<T>(path: string, body?: unknown) {
        return request<T>(path, {
            method: "POST",
            body:
                body === undefined
                    ? undefined
                    : JSON.stringify(body),
        });
    },

    patch<T>(path: string, body?: unknown) {
        return request<T>(path, {
            method: "PATCH",
            body:
                body === undefined
                    ? undefined
                    : JSON.stringify(body),
        });
    },

    delete<T = void>(path: string) {
        return request<T>(path, {
            method: "DELETE",
        });
    },
};
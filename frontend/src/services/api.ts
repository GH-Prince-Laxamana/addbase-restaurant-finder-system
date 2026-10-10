const API_BASE_URL = "/api/v1";

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

let accessTokenListener: ((token: string | null) => void) | null = null;
let authExpiredHandler: (() => void) | null = null;

export function setApiAccessToken(token: string | null) {
    accessToken = token;
    accessTokenListener?.(token);
}

export function setApiAccessTokenListener(
    listener: ((token: string | null) => void) | null
) {
    accessTokenListener = listener;
}

export function setAuthExpiredHandler(
    handler: (() => void) | null
) {
    authExpiredHandler = handler;
}

interface ApiErrorResponse {
    error?: {
        code?: string;
        message?: string;
        details?: Record<string, string>;
    };
}

interface RefreshApiResponse extends ApiErrorResponse {
    accessToken?: string;
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

function isAuthEndpoint(path: string) {
    return /^\/auth\/(login|admin\/login|register|refresh|logout)(?:\?|$)/.test(
        path
    );
}

function createApiError(
    status: number,
    data: ApiErrorResponse | null
) {
    return new ApiError(
        status,
        data?.error?.code || "API_ERROR",
        data?.error?.message || "Request failed.",
        data?.error?.details
    );
}

/**
 * Refreshes the access token using the HTTP-only refresh cookie.
 * Concurrent callers share the same refresh request.
 */
export async function refreshApiAccessToken(): Promise<string> {
    if (refreshPromise) {
        return refreshPromise;
    }

    const pending = (async () => {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = (await response
            .json()
            .catch(() => null)) as RefreshApiResponse | null;

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                setApiAccessToken(null);
                authExpiredHandler?.();
            }

            throw createApiError(response.status, data);
        }

        if (
            typeof data?.accessToken !== "string" ||
            !data.accessToken
        ) {
            throw new ApiError(
                500,
                "INVALID_REFRESH_RESPONSE",
                "The refresh endpoint returned an invalid response."
            );
        }

        setApiAccessToken(data.accessToken);

        return data.accessToken;
    })();

    refreshPromise = pending;

    try {
        return await pending;
    } finally {
        if (refreshPromise === pending) {
            refreshPromise = null;
        }
    }
}

async function request<T>(
    path: string,
    options: RequestInit = {},
    hasRetried = false
): Promise<T> {
    const tokenUsed = accessToken;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(tokenUsed
                ? { Authorization: `Bearer ${tokenUsed}` }
                : {}),
            ...options.headers,
        },
    });

    if (
        response.status === 401 &&
        tokenUsed &&
        !hasRetried &&
        !isAuthEndpoint(path)
    ) {
        try {
            // Another request may already have refreshed this token.
            if (accessToken === tokenUsed) {
                await refreshApiAccessToken();
            }

            // Retry the original request at most once.
            if (accessToken) {
                return await request<T>(path, options, true);
            }
        } catch {
            // Preserve the original request's error below.
        }
    }

    if (!response.ok) {
        const data = (await response
            .json()
            .catch(() => null)) as ApiErrorResponse | null;

        throw createApiError(response.status, data);
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
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    },

    patch<T>(path: string, body?: unknown) {
        return request<T>(path, {
            method: "PATCH",
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    },

    delete<T = void>(path: string) {
        return request<T>(path, {
            method: "DELETE",
        });
    },
};
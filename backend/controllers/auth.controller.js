import {
  authenticateAdminUser,
  authenticateUser,
  createAuthTokens,
  getCurrentUser,
  refreshAuthentication,
  registerUser,
  revokeRefreshToken,
} from "../services/auth.service.js";
import env from "../config/env.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax",
  path: "/api/v1/auth",
};

export async function register(req, res) {
  const { name, email, password } = req.body;

  const user = await registerUser({
    name,
    email,
    password,
  });

  res.status(201).json({
    user,
  });
}

export async function adminLogin(req, res) {
  const { email, password } = req.body;

  const user = await authenticateAdminUser({
    email,
    password,
  });

  const { accessToken, refreshToken } = await createAuthTokens(user);

  res.cookie(env.refreshCookieName, refreshToken, {
    ...refreshCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await authenticateUser({
    email,
    password,
  });

  const { accessToken, refreshToken } = await createAuthTokens(user);

  res.cookie(env.refreshCookieName, refreshToken, {
    ...refreshCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

export async function me(req, res) {
  const user = await getCurrentUser(req.user.id);

  res.json({
    user,
  });
}

export async function refresh(req, res) {
  const refreshToken = req.cookies[env.refreshCookieName];

  if (!refreshToken) {
    return res.status(401).json({
      error: {
        code: "REFRESH_TOKEN_REQUIRED",
        message: "Refresh token is required.",
      },
    });
  }

  const tokens = await refreshAuthentication(refreshToken);

  res.cookie(env.refreshCookieName, tokens.refreshToken, {
    ...refreshCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken: tokens.accessToken,
  });
}

export async function logout(req, res) {
  const refreshToken = req.cookies[env.refreshCookieName];

  await revokeRefreshToken(refreshToken);

  res.clearCookie(env.refreshCookieName, refreshCookieOptions);

  res.status(204).send();
}

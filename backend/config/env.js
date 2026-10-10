import dotenv from "dotenv";

dotenv.config();

function requireEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  // Only explicit proxy IPs/CIDRs are trusted; never trust arbitrary headers.
  trustProxy:
    process.env.TRUST_PROXY?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) || false,
  mongodbUri: requireEnv("MONGODB_URI"),
  jwtAccessSecret: requireEnv("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: requireEnv("JWT_REFRESH_SECRET"),
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  refreshTokenMaxAgeMs: 7 * 24 * 60 * 60 * 1000,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  refreshCookieName: "restaurant_refresh_token",
  adminName: process.env.ADMIN_NAME,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
};

if (env.nodeEnv === "production") {
  if (
    env.jwtAccessSecret.length < 32 ||
    env.jwtRefreshSecret.length < 32 ||
    env.jwtAccessSecret === env.jwtRefreshSecret
  )
    throw new Error(
      "Production JWT secrets must be distinct and at least 32 characters long.",
    );
}

export default env;

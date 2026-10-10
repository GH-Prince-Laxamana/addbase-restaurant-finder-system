# Backend security

Existing route paths and successful response shapes are preserved. Run `npm test` in this folder for isolated HTTP regression tests. Tests mock user lookups and never connect to your database.

## Rate limits

| Scope | Budget | Key |
| --- | --- | --- |
| API | 300 per 15 minutes | Client IP |
| Failed login, including admin login | 20 per 15 minutes | Client IP |
| Failed login across IPs | 10 per 15 minutes | Normalized email hash |
| Registration | 5 per hour | Client IP |
| Refresh | 60 per 15 minutes | Client IP |
| Review, favorite and admin mutations | 60 per 15 minutes | Authenticated user ID |

Blocked requests return HTTP 429 with the existing error envelope, RateLimit headers and Retry-After. Successful logins are removed from failed-login counters. Regular and admin login share budgets. IPv6 addresses use the library's subnet-aware grouping. Refreshing a token does not reset the user write quota.

Counters use express-rate-limit's in-memory store: they reset on restart and are independent across processes. Before running multiple workers/replicas, configure a shared store for every limiter with distinct prefixes. Add request and connection limits at the gateway as well.

## Requests and authorization

- Helmet headers remain enabled; X-Powered-By is disabled; API responses use no-store.
- CLIENT_ORIGIN must match the exact frontend origin (development default: http://localhost:5173). Other browser origins are rejected server-side. Cross-site writes without an approved Origin are blocked. Approved-origin credentialed CORS preflights are supported.
- Non-browser clients without Origin remain supported. Protected endpoints still require bearer authentication. JSON-only POST/PATCH/PUT, SameSite=Lax refresh cookies, and origin/fetch-metadata checks protect cookie endpoints without a frontend contract change. Production cookies are Secure and HttpOnly.
- Bodies are limited to 64 KiB; compression is disabled; bodies must be JSON objects with bounded nesting. Mongo operator/prototype keys are rejected recursively. Duplicate, structured, malformed and overlong query parameters are rejected. Resource IDs must be 24 hexadecimal characters.
- Authentication and restaurant input lengths are bounded; coordinates must be finite; pagination is bounded. Existing review ownership checks, score/comment validation, explicit update-field selection and admin authorization remain enforced.
- JWT verification permits only HS256 and validates claims. Protected requests check the current user and role in MongoDB, immediately rejecting deleted users and demoted administrators. Database failures do not bypass authorization.
- Unexpected errors reveal no stack, database messages or internal details. Parser errors return stable JSON 400/413/415 responses. Logs omit request bodies, tokens and cookies.

## Production configuration

Production requires an HTTPS CLIENT_ORIGIN and distinct JWT_ACCESS_SECRET/JWT_REFRESH_SECRET values of at least 32 characters. Generate high-entropy secrets; never commit them. Existing development secrets are unchanged.

TRUST_PROXY defaults to false. Set comma-separated trusted proxy IPs/CIDRs only when running behind a known proxy that overwrites forwarding headers. Restrict direct access to the backend. Do not use `true` or broad network ranges merely to suppress warnings. See [Express proxy guidance](https://expressjs.com/en/guide/behind-proxies/) and [express-rate-limit documentation](https://github.com/express-rate-limit/express-rate-limit).

Terminate TLS at the trusted proxy and configure gateway header/body/connection limits. Node uses a 10-second header timeout and 30-second request-receive timeout; these are not database execution deadlines. Keep Node and dependencies updated.

Restart the backend to apply changes. No database migration or new dependency is required. Future bulk demo-account creation must respect the registration limit.

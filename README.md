# Restaurant Finder System

Restaurant Finder is a full-stack restaurant discovery and administration application. Users can search and filter restaurants, browse restaurant details and reviews, save favorites, and manage their account. Administrators have a separate dashboard for managing restaurants, reviews, and aggregate statistics.

The project is organized as two applications:

- `backend` - REST API, authentication, business rules, MongoDB access, and seed scripts.
- `frontend` - React single-page application for public discovery, authentication, favorites, and administration.

## Features

- Restaurant search by name and cuisine.
- Filtering by cuisine, borough, minimum rating, and maximum rating.
- Sorting by name, rating, or review count.
- Paginated restaurant results with cuisine, borough, and rating facets.
- Restaurant detail pages with reviews and review authors.
- User registration, login, refresh-token sessions, logout, and favorites.
- User-created reviews with one review per user per restaurant.
- Admin-only restaurant, review, and statistics management.
- Responsive UI with loading skeletons, lazy-loaded routes, retry states, and reduced-motion-aware loading components.

## Technology stack

### Backend

- Node.js with ECMAScript modules.
- Express 5 for HTTP routing and middleware.
- MongoDB with Mongoose 9.
- JSON REST API under `/api/v1`.
- JWT access tokens and HTTP-only refresh-token cookies.
- Argon2 password hashing.
- Helmet, CORS, request validation, and rate limiting.
- Node's built-in test runner for security tests.

### Frontend

- React 19 with TypeScript.
- Vite 8 for development and production builds.
- React Router 7 for client-side routing.
- Tailwind CSS 4 through the Vite plugin.
- `lucide-react` for icons.
- React Context for authentication and favorites.
- Lightweight request/resource caches for public and admin data.
- ESLint, TypeScript, and Node-based UX/style tests.

## Architecture

### System overview

```text
┌──────────────────────┐       /api proxy        ┌────────────────────────────┐
│ React + TypeScript   │ ──────────────────────> │ Express REST API           │
│ Vite + Tailwind      │                         │ /api/v1                    │
│                      │ <────────────────────── │ Auth, restaurants, reviews │
└──────────────────────┘       JSON + cookies    └──────────────┬─────────────┘
                                                                │
                                                                │ Mongoose
                                                                ▼
                                                  ┌────────────────────────────┐
                                                  │ MongoDB                    │
                                                  │ users, restaurants, reviews │
                                                  │ favorites, refresh tokens   │
                                                  └────────────────────────────┘
```

During local development, Vite proxies `/api` requests to `http://localhost:5000`. The browser keeps the access token in application memory and sends the refresh token as an HTTP-only cookie.

### Backend: Repository-Service-Controller architecture

The backend uses a **Repository-Service-Controller (RSC)** structure. Routes compose middleware and select a controller; controllers translate HTTP input/output; services apply application rules; repositories contain database queries and aggregation pipelines.

```text
HTTP request
    │
    ▼
Route + middleware
    │  authentication, authorization, validation, rate limits
    ▼
Controller
    │  reads req, calls one use-case, sends res
    ▼
Service
    │  parsing, defaults, limits, validation, business rules
    ▼
Repository
    │  Mongoose queries and MongoDB aggregation pipelines
    ▼
Model / MongoDB
```

#### Layer responsibilities

- **Routes** (`backend/routes`) define resource URLs and attach middleware. For example, restaurant routes expose public reads and authenticated review/favorite writes.
- **Controllers** (`backend/controllers`) are intentionally thin. They receive request data, call a service, and return the API response.
- **Services** (`backend/services`) own use-case behavior. `restaurant.service.js`, for example, parses pagination and rating values, applies the maximum page size, and rejects invalid rating ranges before querying.
- **Repositories** (`backend/repositories`) own persistence details. This is where filters, sorting, pagination, projections, joins, grouping, and facets are implemented.
- **Models** (`backend/models`) define Mongoose schemas, validation, relationships, timestamps, and indexes.
- **Middleware** (`backend/middleware`) handles security headers, CORS-related request checks, authentication, authorization, validation, rate limiting, and error responses.

This separation keeps controllers independent of MongoDB query details and makes database operations reusable from multiple services or administrative use cases.

### Frontend architecture

The frontend follows a route-to-hook-to-service flow:

```text
Route/page
    │
    ▼
Feature hook
    │  query state, loading/error state, cache subscription
    ▼
Typed API service
    │  URLSearchParams, credentials, token refresh, ApiError
    ▼
Backend REST API
```

- `src/routes` defines public, guest-only, authenticated, and admin-only routes.
- `src/pages` contains user-facing screens for discovery, details, authentication, favorites, and administration.
- `src/hooks` coordinates fetching, cache subscriptions, and resource state.
- `src/services` contains typed API calls and authentication/token-refresh behavior.
- `src/context` provides cross-cutting auth and favorites state.
- `src/components` contains reusable cards, forms, skeletons, and UI primitives.
- `src/utils` contains query-string, image, request-cache, and restaurant-cache helpers.

Routes are lazy-loaded through `PageLoader`, with page-specific skeleton fallbacks. Search and filters are represented in the URL so views can be refreshed or shared without losing the current discovery state.

## MongoDB query design

MongoDB is used not only as document storage but also as the query and reporting engine for restaurant discovery.

### Restaurant filtering and pagination

`backend/repositories/restaurant.repository.js` builds a `$match` object from the public query:

- `isActive: true` keeps inactive restaurants out of public discovery.
- `$text: { $search: q }` searches the weighted `name` and `cuisine` text index.
- `borough` and `cuisine` provide exact filters.
- `avgScore: { $gte, $lte }` implements the rating range.

The repository then runs one aggregation with `$facet`:

- `results` sorts, skips, limits, and projects the fields needed by restaurant cards.
- `pagination` uses `$count` to calculate the total result count.
- `cuisine` and `borough` use `$group` to produce filter facet counts.
- `rating` uses `$bucket` to group results into rating bands.

Returning result rows, pagination, and facets in one database operation keeps the filter panel and result list consistent while avoiding separate count and facet requests.

### Restaurant detail aggregation

`backend/repositories/restaurantDetail.repository.js` builds a complete detail response in one pipeline:

1. `$match` selects the active restaurant by ObjectId.
2. `$lookup` joins reviews from the `reviews` collection.
3. `$unwind` makes each review available for the user join.
4. A second `$lookup` joins the review author from `users`.
5. `$group` reconstructs the restaurant and its review array.
6. `$project` shapes the public response.
7. `$filter` removes the placeholder `null` review created when a restaurant has no reviews.

This avoids exposing raw MongoDB documents and ensures the frontend receives a stable `restaurant` plus `reviews` contract.

### Administrative statistics

`backend/repositories/adminStats.repository.js` uses aggregation for dashboard reporting:

- Overview statistics use `$group`, `$sum`, `$cond`, and `$avg` to calculate total, active, inactive, and rated-restaurant metrics.
- Filtered restaurant statistics reuse the same search/filter semantics as discovery.
- `$facet` calculates top-rated restaurants, most-reviewed restaurants, cuisine summaries, and borough summaries in one query.
- Denormalized `avgScore` and `scoreCount` values on restaurants make ranking and summary queries efficient without recalculating every review for each dashboard request.

### Indexes

Indexes are declared in the Mongoose models and created by the seed process. The important indexes are:

| Collection | Index | Purpose |
| --- | --- | --- |
| `restaurants` | `{ name: "text", cuisine: "text" }` with weights `name: 5`, `cuisine: 2` | Text search, prioritizing restaurant names over cuisine terms |
| `restaurants` | `{ borough: 1, cuisine: 1 }` | Common location and cuisine filter combination |
| `restaurants` | `{ avgScore: -1 }` | Rating-oriented sorting and ranking |
| `restaurants` | Unique `restaurantId` | Preserves the source dataset identifier and prevents duplicates |
| `reviews` | Unique `{ restaurant: 1, user: 1 }` | Enforces one review per user per restaurant |
| `reviews` | `{ restaurant: 1, createdAt: -1 }` | Lists a restaurant's newest reviews efficiently |
| `reviews` | `{ user: 1, createdAt: -1 }` | Finds a user's review history |
| `favorites` | Unique `{ user: 1, restaurant: 1 }` | Prevents duplicate favorites |
| `favorites` | `{ user: 1, createdAt: -1 }` | Lists a user's newest saved restaurants |
| `users` | Unique `email` | Enforces unique login identities |

Mongoose automatic index creation is enabled outside production. The restaurant seed script explicitly calls `Restaurant.createIndexes()` after loading data. In production, indexes should be reviewed and created as part of the deployment process rather than relying on startup-time index creation.

## API overview

All endpoints are prefixed with `/api/v1`.

| Area | Endpoints |
| --- | --- |
| Authentication | `POST /auth/register`, `POST /auth/login`, `POST /auth/admin/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me` |
| Restaurants | `GET /restaurants`, `GET /restaurants/:id`, `GET /restaurants/:id/reviews` |
| Reviews | `POST /restaurants/:id/reviews`, `PATCH /reviews/:id`, `DELETE /reviews/:id` |
| Favorites | `GET /favorites`, `POST /restaurants/:id/favorite`, `DELETE /restaurants/:id/favorite` |
| Admin restaurants | `GET /admin/restaurants`, `POST /admin/restaurants`, `PATCH /admin/restaurants/:id`, `DELETE /admin/restaurants/:id`, `PATCH /admin/restaurants/:id/restore`, `DELETE /admin/restaurants/:id/permanent` |
| Admin reviews | `GET /admin/reviews`, `DELETE /admin/reviews/:id` |
| Admin statistics | `GET /admin/stats/overview`, `GET /admin/stats/restaurants` |

## Local development

### Prerequisites

- Node.js 20 or newer.
- A running MongoDB instance or MongoDB Atlas database.
- npm.

### Install dependencies

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

### Configure the backend

Copy `backend/.env.example` to `backend/.env` and set at least:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/restaurant-finder
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-different-long-random-secret
```

Keep `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` private and distinct. Production secrets must be at least 32 characters long.

### Seed data

From the repository root:

```powershell
node backend\seed\restaurants.js
node backend\seed\admin.js
```

The restaurant seed reads `backend/seed/restaurant.json`, normalizes valid records, upserts by `restaurantId`, and creates restaurant indexes. The admin seed creates the account described by `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` when it does not already exist.

### Run the applications

Start the API:

```powershell
cd backend
npm run dev
```

In a second terminal, start the frontend:

```powershell
cd frontend
npm run dev
```

The default URLs are:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API health/root response: `http://localhost:5000/api/v1/`

## Verification

Run frontend checks from the repository root:

```powershell
npm --prefix frontend run build
npm --prefix frontend run lint
npm --prefix frontend run test:ux
npm --prefix frontend run test:styles
```

Run backend security tests:

```powershell
npm --prefix backend test
```

## Project structure

```text
.
├── backend
│   ├── config/          # Environment and MongoDB connection
│   ├── controllers/     # HTTP adapters
│   ├── middleware/      # Security, auth, validation, errors, limits
│   ├── models/          # Mongoose schemas and indexes
│   ├── repositories/    # MongoDB queries and aggregation pipelines
│   ├── routes/          # API route definitions
│   ├── seed/            # Restaurant and admin data loaders
│   ├── services/        # Use cases and business rules
│   └── server.js        # Application startup
├── frontend
│   ├── src/components/  # Reusable UI
│   ├── src/context/     # Auth and favorites providers
│   ├── src/hooks/       # Data-fetching and cache hooks
│   ├── src/layouts/     # Public and admin shells
│   ├── src/pages/       # Route screens
│   ├── src/routes/      # Route guards and lazy routes
│   ├── src/services/    # Typed API clients
│   └── src/utils/       # Query and cache helpers
└── README.md
```

## Security notes

- Do not commit `.env` files, JWT secrets, database credentials, or admin passwords.
- Access tokens are short-lived; refresh tokens are stored in HTTP-only cookies.
- Passwords are stored as Argon2 hashes and are excluded from normal user queries.
- Public restaurant queries only return active restaurants.
- Admin routes require authentication and the `admin` role.
- Write endpoints are protected by authentication, validation, and rate limits.

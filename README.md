# Task Tracker

A small full-stack task tracker built for the take-home assignment.

**Stack:** Spring Boot 3 (Java 17) · MySQL 8 · React 18 (Vite) · JUnit 5 / MockMvc

## Features

- Full CRUD for tasks (title, description, status, priority, due date, timestamps).
- Tasks belong to a project (`tasks.project_id` → `projects.id`, with `ON DELETE CASCADE`).
- Filtering by status/priority/project, sorting by any of a fixed allow-list of fields, and pagination — all done in SQL via a `Pageable`/JPQL query, not in application code.
- Server-side validation (`jakarta.validation`) with structured error responses; the UI surfaces them in an error banner.
- React frontend: create, edit, complete and delete tasks, with filter/sort controls wired to the API and pagination.
- Backend tests (MockMvc/Spring Boot Test against an in-memory H2 DB) covering create/read/update/delete, a validation failure, a not-found case, filtering, and pagination.

## Project structure

```
task-tracker/
├── backend/     # Spring Boot API
├── frontend/    # React (Vite) SPA
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Running it locally

### Option A — Docker Compose (recommended, least setup)

Requires only Docker Desktop installed.

```bash
docker compose up --build
```

This starts MySQL on `3306` and the API on `8080`. Then run the frontend separately (see below) — it's not containerized since you'll want hot-reload while looking at the code.

### Option B — Run everything natively

You'll need:

- **Java 17+ JDK**
- **Maven** (or use the included `mvnw` wrapper if present — otherwise install Maven)
- **MySQL 8** running locally, with a user that can create databases
- **Node.js 18+** and npm

**1. Database**

Create a MySQL user/password that matches `backend/src/main/resources/application.properties` (defaults to `root`/`root`), or override via environment variables:

```bash
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
```

The app will create the `task_tracker` database and tables automatically on first run (`createDatabaseIfNotExist=true`, `ddl-auto=update`). `backend/src/main/resources/schema.sql` documents the same schema by hand if you want to create it manually instead.

**2. Backend**

```bash
cd backend
mvn spring-boot:run
```

API comes up on `http://localhost:8080`.

**3. Frontend**

```bash
cd frontend
npm install
npm run dev
```

UI comes up on `http://localhost:5173` and talks to the API at `http://localhost:8080` (see `frontend/src/api.js`).

**4. Tests**

```bash
cd backend
mvn test
```

Tests run against an in-memory H2 database (`src/test/resources/application.properties`), so they don't touch your real MySQL data.

## API reference

Base URL: `/api`

| Method | Path | Description |
|---|---|---|
| GET | `/tasks` | List tasks. Query params: `status`, `priority`, `projectId`, `sortBy` (`dueDate`\|`createdAt`\|`updatedAt`\|`priority`\|`status`\|`title`), `sortDir` (`asc`\|`desc`), `page`, `size`. Returns a page object: `{ items, page, size, totalElements, totalPages }`. |
| GET | `/tasks/{id}` | Get one task. 404 if missing. |
| POST | `/tasks` | Create a task. 201 + body on success, 422 on validation failure, 404 if `projectId` doesn't exist. |
| PUT | `/tasks/{id}` | Replace a task's fields. Same validation rules as create. |
| PATCH | `/tasks/{id}/status?status=DONE` | Convenience endpoint used by the "Complete" button. |
| DELETE | `/tasks/{id}` | Delete a task. 204 on success, 404 if missing. |
| GET | `/projects` | List projects. |
| POST | `/projects` | Create a project. |
| PUT | `/projects/{id}` | Update a project. |
| DELETE | `/projects/{id}` | Delete a project (cascades to its tasks). |

**Task fields:** `title` (required, ≤150 chars), `description` (optional, ≤2000 chars), `status` (`TODO`\|`DOING`\|`DONE`), `priority` (`LOW`\|`MEDIUM`\|`HIGH`), `dueDate` (optional, `YYYY-MM-DD`), `projectId` (required, must reference an existing project).

**Status codes:** `400` for malformed requests, `404` for missing resources, `422` for semantic validation failures (e.g. blank title) with a `details` array describing each failing field.

## Design notes

- **Why `ddl-auto=update` + a hand-written `schema.sql`:** Hibernate manages the actual schema for development speed, but `schema.sql` is kept as the canonical, reviewable description of the tables/FK/indexes, matching what Hibernate produces. For a real production system I'd replace this with a proper migration tool (Flyway/Liquibase) so schema changes are versioned and reviewable independently of the entity code.
- **Filtering/sorting/pagination in SQL:** the `/tasks` list endpoint uses a single JPQL query with optional predicates (`:status IS NULL OR ...`) plus a Spring `Pageable`, so MySQL does the filtering, sorting and `LIMIT/OFFSET` — the app never loads more rows than a page needs. `sortBy` is restricted to an allow-list of real entity fields to avoid passing arbitrary strings into a `Sort`.
- **Validation:** request DTOs (`TaskRequest`/`ProjectRequest`) carry `jakarta.validation` annotations; failures map to `422 Unprocessable Entity` with a list of `field: message` strings, which the frontend renders directly. A missing `projectId` reference is treated as `404` rather than a validation error, since the request is well-formed but points at something that doesn't exist.
- **DTOs vs. entities:** the API never serializes JPA entities directly (aside from the simple `Project` list) to avoid lazy-loading surprises and to keep the wire format stable if the entity shape changes.
- **What I'd add for production:** authentication/authorization (the assignment didn't ask for it, so I left it out to stay within scope), Flyway migrations instead of `ddl-auto`, optimistic concurrency (a `@Version` column) so two people editing the same task don't silently clobber each other, idempotency on create, a "soft delete" instead of hard delete for audit history, and OpenAPI/Swagger docs generated from the controllers rather than the hand-written table above.
- **What I intentionally left out:** auth, multi-user ownership of tasks, real-time updates, and a project-management UI beyond a dropdown — all out of scope for a 4–6 hour assignment per the brief.

## AI assistant usage disclosure

I used Claude (Anthropic) to help scaffold this project: generating the initial Spring Boot project structure (entities, repositories, controllers, DTOs, exception handling), the React components, the test suite, the Docker/CI setup, and this README. I reviewed and adjusted the generated code (e.g. the SQL filtering query, the validation status codes, and the pagination contract between frontend/backend) rather than using it unmodified. No part of the assignment's actual requirements gathering or design decisions was outsourced — the architecture choices described above are mine; Claude was used as a typing accelerant.

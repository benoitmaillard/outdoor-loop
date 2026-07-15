# AGENTS.md

## Purpose and layout

OutdoorLoop is a route planner for hiking and cycling. The repository contains:

- `frontend/`: Angular single-page application. `src/app/` is organized by feature: `route-planner`, `map-view`, `route-panel`, `auth`, `error-display`, and `graphhopper` models/services. `public/` contains static assets.
- `backend/`: Spring Boot REST API. Java packages are split into `controller`, `model`, `repository`, `security`, and `validation`; runtime configuration and Flyway migrations are under `src/main/resources`.
- `docker-compose.yml`: local PostgreSQL, backend, and Nginx-served frontend stack.
- `.github/workflows/ci.yml`: CI test/build commands for Node 18 and Java 17.

Generated/ignored directories such as `frontend/node_modules`, `frontend/dist`, and `backend/target` are build outputs and should not be edited.

## Technologies and versions

- Frontend: Angular 19.1, Angular CLI/build-angular 19.1.4, TypeScript 5.7.2, RxJS 7.8, Node 18 in CI and the frontend image.
- UI/maps: Tailwind CSS 3.4.17, DaisyUI 4.12.23, MapLibre GL 5.1, `@maplibre/ngx-maplibre-gl` 18.2, Graphology 0.26.
- Backend: Java 17, Maven Wrapper using Maven 3.9.9, Spring Boot 3.4.3, Spring Web/Data JPA/Security, Lombok, PostgreSQL driver, JJWT 0.12.6, Flyway 11.3.4.
- Tests: Jasmine/Karma in the frontend; Spring Boot test, MockMvc, JUnit 5, H2 2.1.214 in the backend.
- Containers: PostgreSQL 17.4, `eclipse-temurin:17-jdk` backend image, and `nginx:alpine` frontend image.

Dependencies are declared in `frontend/package.json`/`package-lock.json` and `backend/pom.xml`; keep lockfiles and those manifests synchronized.

## Build, run, and test

Run frontend commands from `frontend/`:

```sh
npm install
npm start                         # Angular dev server; development environment is selected
npm run build                     # production build, output: dist/outdoorloop/browser
npm run test -- --watch=false --browsers=ChromeHeadless
```

The development environment sends GraphHopper requests to `http://localhost:8989/route`. The production environment uses an empty routing URL. Map tiles come from OpenStreetMap and nearby-road queries use the public Overpass API.

Run backend commands from `backend/`:

```sh
./mvnw spring-boot:run
./mvnw clean package
./mvnw test
```

The backend uses PostgreSQL settings from `POSTGRES_USER` and `POSTGRES_PASSWORD` and the database host `postgres` in the default application configuration. Tests activate the `test` profile and use an in-memory H2 database; Flyway migrations are applied during the test context.

The main API surface is `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/routes`, and `POST /api/routes`. Authentication is JWT-based, stored in an HTTP-only `token` cookie; `/api/auth/**` is public and other routes require authentication.

## Docker development workflow

Create a local root `.env` (it is ignored) containing the PostgreSQL variables consumed by Compose: `POSTGRES_NAME`, `POSTGRES_USER`, and `POSTGRES_PASSWORD`. The Compose file creates database `outdoorloop`, persists PostgreSQL data in volume `pgdata`, and exposes PostgreSQL on `5432`, the backend on `8080`, and the frontend on `3000`.

Because `backend/Dockerfile` copies `backend/target/*.jar`, package the backend before building or starting the Compose stack:

```sh
cd backend && ./mvnw clean package
cd ..
docker compose up --build
```

Stop the stack with `docker compose down`. Do not add `-v` unless the local database volume should be deleted. Compose starts PostgreSQL before the backend and builds the frontend as a static Angular bundle served by Nginx.

## Architectural conventions

- Angular uses standalone components, `provideRouter`, and `provideHttpClient`; components, templates, styles, and specs live together by feature.
- Shared route state belongs in the root-provided `MapService`, using Angular signals for waypoints/paths and RxJS streams for HTTP and transient errors. `GraphHopperService` owns routing API request construction and response mapping; map rendering is isolated in `MapViewComponent`.
- Frontend domain/API shapes are TypeScript interfaces in the relevant feature directory. Preserve GraphHopper coordinate order: API GeoJSON is `[longitude, latitude]`, while request points are sent as `lat,lon`.
- Backend persistence follows JPA entities plus Spring Data repository interfaces, with REST controllers under `/api`. Validation is expressed with Jakarta validation annotations; duplicate usernames are checked with the custom `@UniqueEmail` validator.
- Security is stateless: BCrypt hashes passwords, `JwtFilter` reads the `token` cookie, and `SecurityConfig` permits only authentication endpoints.

## Database migrations

Flyway scans `backend/src/main/resources/db/migration`. The existing migration is `V1__init.sql`, creating `route` and unique-username `users` tables. Add schema changes as a new, forward-only versioned migration named `V2__description.sql`, `V3__description.sql`, and so on. Never edit a migration that may already have run; update the JPA model and add a migration together. Verify migrations through `./mvnw test` or application startup against PostgreSQL.

## Verification checklist

For frontend changes, run:

```sh
cd frontend
npm run build
npm run test -- --watch=false --browsers=ChromeHeadless
```

For backend changes, run:

```sh
cd backend
./mvnw test
./mvnw clean package
```

For changes affecting deployment, also run `docker compose config` and the Docker workflow above. Review `git status --short` before handoff so generated artifacts or unrelated files are not included.

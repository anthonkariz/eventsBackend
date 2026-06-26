# backendEvents

Express API organized with config, controllers, middlewares, models, routes, services, and utilities.

## Structure

```text
src/
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
  utils/
  app.js
tests/
server.js
```

## Scripts

- `npm start` starts the API server.
- `npm run dev` starts the API server with nodemon.
- `npm test` runs the basic HTTP tests.

## Environment

Set the values in `.env` for PostgreSQL and JWT configuration.

## Routes

- `GET /` returns all events.
- `GET /health` returns the health status.
- `POST /auth/register` creates a user account and returns a JWT.
- `POST /auth/login` authenticates a user and returns a JWT.
- `GET /users` returns all users and requires a Bearer token.
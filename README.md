# Backend REST API

Express REST API with user register and login. Uses MongoDB (Mongoose), JWT, and separate controllers, models, and routes.

## Environment

Copy `.env.example` to `.env` and set:

- `PORT` – server port (default: 6050)
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – secret for signing JWTs

## Run

```bash
npm install
npm run dev   # development with nodemon
npm start     # production
```

## API

Base URL: `http://localhost:6050` (or your `PORT`).

### Register

- **POST** `/api/auth/register`
- Body: `{ "name": "string", "email": "string", "password": "string" }`
- Name and password: minimum 4 characters.
- Success: `201` with `{ "success": true, "data": { "user": { "id", "name", "email" } } }`.

### Login

- **POST** `/api/auth/login`
- Body: `{ "email": "string", "password": "string" }`
- Success: `200` with `{ "success": true, "data": { "token", "user": { "id", "name", "email" } } }`.

### Error format

- `{ "success": false, "message": "User-friendly error message" }`

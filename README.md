# Box League (boxL) Backend API

Welcome to the backend API for the Box League app. This service provides endpoints for managing box league data and user authentication.
The API can be found here: https://boxl-api.onrender.com/
A list of available endpoints is below.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Dependencies](#dependencies)
- [API Endpoints](#api-endpoints)

## Features

- Provides endpoints for managing box league data.
- Implements user authentication with JWT verification (only access token, not refresh).
- Includes rigorous end-to-end testing suite with Jest.
- Middleware for controlling the flow of data.
- Error handling to provide meaningful responses to the client.

## Prerequisites

Before running the server, ensure you have the following installed:

- Node.js (v14.x or higher)
- npm (v6.x or higher)

## Dependencies

Make sure the following dependencies are installed:

- bcrypt (^5.1.1)
- cors (^2.8.5)
- dotenv (^16.3.1)
- express (^4.18.2)
- jsonwebtoken (^9.0.2)
- pg (^8.11.3)
- pg-format (^1.0.4)
- supertest (^6.3.4)

```bash
npm install bcrypt cors dotenv express jsonwebtoken pg pg-format supertest
```

## API Endpoints

The following endpoints are currently active and require JWT verification to access. The can be found at https://boxl-api.onrender.com/api. 

- **GET /api**
- **GET /api/leagues**
- **GET /api/users/:userId**
- **GET /api/leagues/users/:userId**
- **GET /api/leagues/:leagueId**
- **GET /api/results/leagues/:leagueId**
- **GET /api/results/users/:userId**
- **GET /api/clubs/:clubId**
- **GET /api/users/leagues/:leagueId**
- **GET /api/users/leagues/:leagueId/standings**
- **POST /api/users**
- **POST /api/results**
- **POST /api/users/login**
- **PATCH /api/standings**

These need to be extended to include (non exhaustive):
- **POST /api/leagues**: creating a new league
- **PATCH /api/leagues/:leagueId/:resultId** deleting a result 
- **DELETE /api/leagues/:leagueId/:resultId** deleting a result

Cheers!

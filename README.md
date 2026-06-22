# Messaging App API

Chat backend built with Express, MongoDB, Mongoose, and Socket.io.

## Overview

This service provides a simple REST API for:

- creating users
- listing users
- sending messages between users
- fetching a conversation between two users
- broadcasting new messages over Socket.io

## Tech Stack

- Node.js
- Express
- MongoDB Atlas / MongoDB
- Mongoose
- Socket.io

## Project Structure

- `index.js` - app entrypoint and server bootstrap
- `src/config/db.js` - MongoDB connection
- `src/controllers/` - request handlers
- `src/models/` - Mongoose models
- `src/routes/` - route definitions

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root folder:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

### 3. Start the server

```bash
npm start
```

Development mode:

```bash
npm run dev
```

## Base URL

```text
http://localhost:3000
```

## Health Check

### GET /

Returns a basic status response with available endpoints.

#### Response 200

```json
{
  "message": "Chat backend is running",
  "endpoints": {
    "createUser": "POST /users",
    "listUsers": "GET /users",
    "sendMessage": "POST /messages",
    "listConversation": "GET /messages/:user1/:user2"
  }
}
```

## Users API

### POST /users

Creates a new user.

#### Request body

```json
{
  "username": "alice"
}
```

#### Response 201

```json
{
  "id": "665f1a2b3c4d5e6f7a8b9c0d",
  "username": "alice",
  "createdAt": "2026-06-22T12:00:00.000Z"
}
```

#### Response 400

Returned when `username` is missing, empty, or not a string.

```json
{
  "error": "username is required"
}
```

#### Response 409

Returned when the username already exists.

```json
{
  "error": "username already exists"
}
```

#### Response 500

```json
{
  "error": "Internal server error"
}
```

### GET /users

Returns all users sorted by creation time.

#### Response 200

```json
[
  {
    "id": "665f1a2b3c4d5e6f7a8b9c0d",
    "username": "alice",
    "createdAt": "2026-06-22T12:00:00.000Z"
  },
  {
    "id": "665f1a2b3c4d5e6f7a8b9c0e",
    "username": "bob",
    "createdAt": "2026-06-22T12:05:00.000Z"
  }
]
```

#### Response 500

```json
{
  "error": "Internal server error"
}
```

## Messages API

### POST /messages

Sends a message from one existing user to another existing user.

#### Request body

```json
{
  "sender": "alice",
  "receiver": "bob",
  "text": "Hello Bob"
}
```

#### Response 201

```json
{
  "id": "665f1a2b3c4d5e6f7a8b9c0f",
  "sender": "alice",
  "receiver": "bob",
  "text": "Hello Bob",
  "timestamp": "2026-06-22T12:10:00.000Z"
}
```

#### Response 400

Returned when any of `sender`, `receiver`, or `text` is missing.

```json
{
  "error": "sender, receiver and text are required"
}
```

#### Response 404

Returned when either user does not exist.

```json
{
  "error": "Both sender and receiver must be valid users"
}
```

#### Response 500

```json
{
  "error": "Internal server error"
}
```

### GET /messages/:user1/:user2

Returns the full conversation between two usernames, sorted by message time.

#### Example request

```text
GET /messages/alice/bob
```

#### Response 200

```json
[
  {
    "id": "665f1a2b3c4d5e6f7a8b9c0f",
    "sender": "alice",
    "receiver": "bob",
    "text": "Hello Bob",
    "timestamp": "2026-06-22T12:10:00.000Z"
  },
  {
    "id": "665f1a2b3c4d5e6f7a8b9c10",
    "sender": "bob",
    "receiver": "alice",
    "text": "Hi Alice",
    "timestamp": "2026-06-22T12:11:00.000Z"
  }
]
```

#### Empty conversation response

If either user does not exist, the API returns an empty array.

```json
[]
```

#### Response 500

```json
{
  "error": "Internal server error"
}
```

## Socket.io Events

### Server event: `new_message`

Emitted whenever a message is successfully created.

#### Payload

```json
{
  "id": "665f1a2b3c4d5e6f7a8b9c0f",
  "sender": "alice",
  "receiver": "bob",
  "text": "Hello Bob",
  "timestamp": "2026-06-22T12:10:00.000Z"
}
```

## Data Models

### User

- `username` - required, unique, trimmed string
- timestamps are enabled automatically

### Message

- `sender` - required reference to `User`
- `receiver` - required reference to `User`
- `text` - required trimmed string
- timestamps are enabled automatically

## Common Response Summary

- `200 OK` - successful GET requests and empty conversation fallback
- `201 Created` - successful create/send requests
- `400 Bad Request` - validation failure for user or message creation
- `404 Not Found` - sender or receiver user not found while sending a message
- `409 Conflict` - duplicate username
- `500 Internal Server Error` - unexpected server failure

## Notes

- All usernames are matched case-insensitively when creating users.
- Conversation history is returned in ascending order by message creation time.
- Message sending also broadcasts the created message through Socket.io using the `new_message` event.
# BCard Node API

BCard Node API is a backend server built with Node.js, Express, MongoDB, and Mongoose.

The project manages users and business cards. It includes authentication with JWT, protected routes, admin-only routes, business-only card creation, seed data, and basic CRUD operations for users and cards.

---

## Project Purpose

This project was built as a backend API for a business card system.

The system allows:

- Registering users
- Logging in users
- Managing users
- Creating business cards
- Reading business cards
- Updating business cards
- Deleting business cards
- Liking and unliking cards
- Getting cards created by the logged-in user
- Seeding the database with initial users and cards

---

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors
- morgan
- nodemon

---

## Project Structure

```txt
bcard-node
│
├── src
│   ├── config
│   │   ├── config.js
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── usersController.js
│   │   └── cardsController.js
│   │
│   ├── initialData
│   │   └── seed.js
│   │
│   ├── middlewares
│   │   ├── auth.js
│   │   └── error.js
│   │
│   ├── models
│   │   ├── User.js
│   │   └── Card.js
│   │
│   ├── routes
│   │   ├── users.js
│   │   └── cards.js
│   │
│   ├── validations
│   │
│   └── app.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Installation

Clone the project:

```bash
git clone https://github.com/aneesabonade/bcard-node.git
```

Go into the project folder:

```bash
cd bcard-node
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root folder.

Example:

```env
PORT=8181
MONGO_URI=mongodb://127.0.0.1:27017/bcard-node
JWT_SECRET=super_secret_key_123
```

A safe example file is included:

```txt
.env.example
```

Do not upload the real `.env` file to GitHub.

---

## Run The Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Expected result:

```txt
✅ MongoDB connected: 127.0.0.1
🚀 Server running on http://localhost:8181
```

---

## Health Check

Open in browser:

```txt
http://localhost:8181/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---

## Seed Data

To insert initial users and cards into MongoDB:

```bash
npm run seed
```

Expected result:

```txt
✅ Seed data imported successfully

Test users:
Admin: admin@test.com / 123456
Business: business@test.com / 123456
Regular: user@test.com / 123456
```

To clear the database:

```bash
node src/initialData/seed.js -d
```

---

## Test Users

### Admin User

```txt
Email: admin@test.com
Password: 123456
Role: Admin
Business: Yes
```

### Business User

```txt
Email: business@test.com
Password: 123456
Role: User
Business: Yes
```

### Regular User

```txt
Email: user@test.com
Password: 123456
Role: User
Business: No
```

---

## API Routes

Base URL:

```txt
http://localhost:8181/api
```

---

# Users Routes

## Register User

```http
POST /api/users
```

Body example:

```json
{
  "name": {
    "first": "Anees",
    "middle": "",
    "last": "Abonade"
  },
  "phone": "0500000000",
  "email": "anees@test.com",
  "password": "123456",
  "image": {
    "url": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    "alt": "User image"
  },
  "address": {
    "state": "",
    "country": "Israel",
    "city": "Jerusalem",
    "street": "Main",
    "houseNumber": 1,
    "zip": 90000
  },
  "isBusiness": true
}
```

---

## Login User

```http
POST /api/users/login
```

Body:

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

Successful response includes a JWT token.

Use the token in protected routes:

```txt
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Get Logged-In User

```http
GET /api/users/me
```

Requires token.

---

## Get All Users

```http
GET /api/users
```

Requires admin token.

---

## Get User By ID

```http
GET /api/users/:id
```

Requires token.

---

## Update User

```http
PUT /api/users/:id
```

Requires token.

Body example:

```json
{
  "name": {
    "first": "Updated",
    "middle": "",
    "last": "User"
  },
  "phone": "0509999999",
  "isBusiness": true
}
```

---

## Delete User

```http
DELETE /api/users/:id
```

Requires admin token.

---

# Cards Routes

## Get All Cards

```http
GET /api/cards
```

Public route.

---

## Get Card By ID

```http
GET /api/cards/:id
```

Public route.

---

## Get My Cards

```http
GET /api/cards/my-cards
```

Requires token.

---

## Create Card

```http
POST /api/cards
```

Requires business user or admin token.

Body example:

```json
{
  "title": "Anees Business",
  "subtitle": "Full Stack Developer",
  "description": "Business card for development services.",
  "phone": "0503333333",
  "email": "business@test.com",
  "web": "https://example.com",
  "image": {
    "url": "https://cdn.pixabay.com/photo/2017/06/10/07/18/list-2389219_960_720.png",
    "alt": "Business card image"
  },
  "address": {
    "state": "",
    "country": "Israel",
    "city": "Jerusalem",
    "street": "Jaffa",
    "houseNumber": 20,
    "zip": 90000
  }
}
```

---

## Update Card

```http
PUT /api/cards/:id
```

Requires token.

Only the card owner or admin can update the card.

---

## Delete Card

```http
DELETE /api/cards/:id
```

Requires token.

Only the card owner or admin can delete the card.

---

## Like / Unlike Card

```http
PATCH /api/cards/:id
```

Requires token.

If the user already liked the card, the route removes the like.  
If the user did not like the card, the route adds the like.

---

## Authentication And Permissions

The project uses JWT authentication.

Protected routes require:

```txt
Authorization: Bearer TOKEN
```

There are 3 main user types:

| Type | Description |
|---|---|
| Regular user | Can login, view cards, like cards |
| Business user | Can create cards |
| Admin user | Can manage users and cards |

---

## Main Routes Summary

### Users

| Method | Route | Access |
|---|---|---|
| POST | `/api/users` | Public |
| POST | `/api/users/login` | Public |
| GET | `/api/users/me` | Logged-in user |
| GET | `/api/users` | Admin |
| GET | `/api/users/:id` | Logged-in user |
| PUT | `/api/users/:id` | Logged-in user |
| DELETE | `/api/users/:id` | Admin |

### Cards

| Method | Route | Access |
|---|---|---|
| GET | `/api/cards` | Public |
| GET | `/api/cards/:id` | Public |
| GET | `/api/cards/my-cards` | Logged-in user |
| POST | `/api/cards` | Business/Admin |
| PUT | `/api/cards/:id` | Owner/Admin |
| DELETE | `/api/cards/:id` | Owner/Admin |
| PATCH | `/api/cards/:id` | Logged-in user |

---

## How To Test In Postman / Thunder Client

1. Run MongoDB locally.
2. Run the server:

```bash
npm run dev
```

3. Run seed:

```bash
npm run seed
```

4. Login with:

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

5. Copy the token from the login response.
6. Add this header to protected routes:

```txt
Authorization: Bearer YOUR_TOKEN_HERE
```

7. Test users and cards endpoints.

---

## Common Problems

### Server does not start

Check that MongoDB is running and that `.env` exists.

### MONGO_URI is not defined

Make sure `.env` contains:

```env
MONGO_URI=mongodb://127.0.0.1:27017/bcard-node
```

### Invalid token

Login again and copy the new token.

### Cannot create card

Only a business user or admin can create cards.

Use:

```txt
business@test.com / 123456
```

or:

```txt
admin@test.com / 123456
```

---

## GitHub Notes

The following files and folders should not be uploaded:

```txt
node_modules
.env
```

The repository should include:

```txt
src
package.json
README.md
.env.example
.gitignore
```

---

## Author

Anees Abonade

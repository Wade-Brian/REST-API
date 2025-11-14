User REST API
A simple REST API for user management with Express.js and JSON database.

Features
GET /users - Get all users

POST /users - Create new user

PUT /users/:id - Update user by ID

DELETE /users/:id - Delete user by ID

Quick Start
bash
npm install
npm start
Server runs on http://localhost:5000

API Usage
Create User (POST):

json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25,
  "country": "USA"
}
Update User (PUT):

json
{
  "name": "John Smith",
  "age": 30
}
Testing
Use Thunder Client or Postman to test all endpoints.

Project Structure
server.js - Main application

users.json - JSON database

package.json - Dependencies

Checkpoint Project - Complete REST API with CRUD operations


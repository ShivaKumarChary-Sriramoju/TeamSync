# TeamSync

A real-time team collaboration platform built with the MERN stack.
Teams create workspaces, manage tasks on Kanban boards, and work with role-based permissions.

## Features (so far)
- JWT authentication with refresh tokens in httpOnly cookies
- Workspaces with invites and member management
- Role-based access control: Admin, Manager, Member
- Jest and Supertest tests for auth and permission rules

## In progress
- Kanban boards with drag and drop
- Live updates with Socket.io
- Comments, chat and dashboard

## Tech stack
React, Vite, Tailwind CSS, Zustand, Node.js, Express, MongoDB, Mongoose, JWT, Zod

## Run locally
1. Copy `server/.env.example` to `server/.env` and fill in your values
2. Copy `client/.env.example` to `client/.env`
3. In `server/`: `npm install` then `npm run dev`
4. In `client/`: `npm install` then `npm run dev`
5. Open http://localhost:5173
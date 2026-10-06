Product Requirements Document (PRD)
TeamSync: Real-time Team Collaboration Platform
Version	1.0
Stack	MERN (MongoDB, Express, React, Node) + Socket.io
Status	Ready for development
1. Overview
TeamSync is a web app where teams plan work on Kanban boards and talk to each other, with every change appearing live on everyone's screen. Think of it as a lightweight mix of Trello and Slack.

2. Problem
Small teams track tasks in chats, sheets and memory, so work gets lost.
Tools like Jira are too heavy for small teams and students.
Page-refresh tools make people work on outdated information.
3. Goals and non-goals
Goals

One place for tasks, comments and chat per team.
Updates visible to all members in under 1 second.
Clear permissions so people only do what their role allows.
Non-goals (v1)

Video calls, time tracking, billing, native mobile apps.
4. Users
Persona	Need
Admin (team owner)	Create workspace, manage members and roles
Manager	Plan boards, create and assign tasks, watch progress
Member	See own tasks, update status, comment, chat
5. Roles and permissions
Action	Admin	Manager	Member
Delete workspace	Yes	No	No
Invite or remove members	Yes	No	No
Change roles	Yes	No	No
Create or delete boards	Yes	Yes	No
Create and assign tasks	Yes	Yes	No
Move or edit assigned tasks	Yes	Yes	Yes
Comment and chat	Yes	Yes	Yes
View dashboard	Yes	Yes	Own stats
6. Scope
MVP (must have)

Signup, login, logout, JWT with refresh token
Workspaces and member invites
Boards with columns (To Do, In Progress, Done)
Tasks: title, description, assignee, due date, priority, labels
Drag-and-drop task movement
Real-time sync of task changes (Socket.io)
Role-based access control
Phase 2 (should have) 8. Task comments with live updates 9. Workspace chat with typing indicator 10. In-app notifications and activity log 11. File attachments (Cloudinary or S3) 12. Search, filters, pagination

Phase 3 (nice to have) 13. Dashboard analytics (Recharts) 14. Email reminders for due dates (Nodemailer + node-cron) 15. Redis pub/sub for scaling Socket.io 16. AI task summary or subtask suggestions

7. Key user stories and acceptance criteria
ID	Story	Acceptance criteria
US-1	As a user, I can sign up and log in	Password hashed; invalid login shows error; protected pages redirect to login
US-2	As an Admin, I can invite a member by email	Invited user appears in the member list with the chosen role
US-3	As a Manager, I can create a task and assign it	Assignee sees the task live without refresh
US-4	As a Member, I can drag my task to another column	Change saved in DB; all other users see it within 1 second
US-5	As a Member, I cannot delete a board	API returns 403; UI hides the button
US-6	As a user, I can comment on a task	Comment shows live and notifies the assignee
8. Non-functional requirements
Performance: API response under 300 ms for common calls; board loads under 2 s.
Security: bcrypt passwords, JWT expiry, input validation (Zod or Joi), rate limiting, CORS, Helmet.
Reliability: socket auto-reconnect; optimistic UI with rollback on failure.
Quality: 70%+ coverage on core APIs (Jest + Supertest); ESLint and Prettier.
Responsive: works on desktop and mobile browsers.
9. Architecture
React (Vite) --REST--> Express API --Mongoose--> MongoDB Atlas
     ^                      |
     +----- Socket.io ------+   (rooms per workspace)
Each workspace is a Socket.io room; events are broadcast only to that room.
Socket connections authenticate with the same JWT.
10. Data model (MongoDB)
Collection	Main fields
users	name, email, passwordHash, avatar, createdAt
workspaces	name, ownerId, members[{userId, role}]
boards	workspaceId, title, columns[{id, name, order}]
tasks	boardId, columnId, title, description, assigneeId, priority, labels[], dueDate, order, attachments[]
comments	taskId, userId, text, createdAt
messages	workspaceId, userId, text, createdAt
activities	workspaceId, userId, action, targetId, createdAt
notifications	userId, type, refId, read, createdAt
Indexes: tasks(boardId, columnId, order), tasks(assigneeId, dueDate), messages(workspaceId, createdAt), users(email unique).

11. API outline
Area	Endpoints
Auth	POST /auth/register, /auth/login, /auth/refresh, /auth/logout
Workspaces	GET/POST /workspaces, POST /workspaces/:id/invite, PATCH /workspaces/:id/members/:uid
Boards	GET/POST /workspaces/:id/boards, PATCH/DELETE /boards/:id
Tasks	GET/POST /boards/:id/tasks, PATCH /tasks/:id, PATCH /tasks/:id/move, DELETE /tasks/:id
Comments	GET/POST /tasks/:id/comments
Chat	GET /workspaces/:id/messages
Analytics	GET /workspaces/:id/stats
12. Real-time events (Socket.io)
Event	Direction	Purpose
workspace:join	client to server	Join the workspace room
task:created / task:updated / task:moved / task:deleted	server to room	Keep boards in sync
comment:added	server to room	Live comments
chat:message	both	Send and receive chat
chat:typing	both	Typing indicator
notification:new	server to user	Personal alerts
13. Folder structure
teamsync/
  client/   (components, pages, hooks, store, services, utils)
  server/   (config, models, routes, controllers, middleware, sockets, validators, tests)
  docker-compose.yml
  README.md
14. Team roles (for a group of 3-4)
Role	Owns
Frontend developer	UI, drag-and-drop, state management, socket client
Backend developer	REST APIs, auth, RBAC, validation
Real-time and DB developer	Socket.io events, schemas, indexes, Redis
DevOps and QA (can be shared)	Docker, CI/CD, tests, deployment, docs
Solo developer: follow the milestone order below.

15. Milestones
Sprint	Duration	Deliverable
1	Week 1	Project setup, auth (signup, login, JWT)
2	Week 2	Workspaces, members, roles, RBAC middleware
3	Week 3	Boards and tasks CRUD, Kanban UI with drag-and-drop
4	Week 4	Socket.io real-time sync (MVP complete)
5	Week 5	Comments, chat, notifications, activity log
6	Week 6	Attachments, search, filters, dashboard
7	Week 7	Tests, Docker, CI/CD, deployment, README and diagrams
16. Working agreements
Git: main (stable), dev (integration), feature/<name> branches; pull request plus one review before merge.
Commits: clear messages (feat:, fix:, docs:).
Definition of done: code reviewed, validated inputs, tests passing, no console errors, works with two browsers live.
Daily 10-minute sync; weekly demo at the end of each sprint.
17. Success metrics
Task move appears on other screens in under 1 second.
0 critical security issues (unauthorized access blocked on all routes).
Live demo link working, with sample data and screenshots in the README.
Core API test coverage above 70%.
18. Risks and mitigations
Risk	Mitigation
Too many features, nothing finished	Ship MVP first; Phase 2 and 3 only after
Out-of-sync data between users	Server is the source of truth; refetch on reconnect
Permission bugs	Central RBAC middleware plus tests per role
Free hosting sleeps (Render)	Add a warm-up note in the README or use a keep-alive ping
19. Deployment
Frontend: Vercel. Backend: Render or Railway. Database: MongoDB Atlas.
CI: GitHub Actions runs lint and tests on every pull request.
Environment variables kept in .env (never committed); .env.example provided.
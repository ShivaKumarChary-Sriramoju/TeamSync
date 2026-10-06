# TeamSync Build Log

## Phase 1: Auth & Project Setup
Sets up the MERN stack with Vite/Tailwind v4. Implements JWT authentication, securely storing refresh tokens in `httpOnly` cookies.

### Files
| File | Purpose |
|------|---------|
| `server/controllers/auth.controller.js` | Handles register, login, refresh, and logout logic |
| `server/routes/auth.routes.js` | Defines auth endpoints |
| `server/validators/auth.validator.js` | Zod schemas for validating auth requests |
| `server/middleware/auth.middleware.js` | Protects routes by validating JWT access tokens |
| `client/src/store/authStore.js` | Zustand store managing client auth state |
| `client/src/pages/Login.jsx` & `Register.jsx` | UI forms for user authentication |

### How to test manually
1. Start both servers (`npm run dev`)
2. Go to `localhost:5173/register` and create an account
3. Check devtools for the `refreshToken` cookie

---

## Phase 2: Workspaces & RBAC
Implements workspace creation, member invitations, and Role-Based Access Control (RBAC).

### Files
| File | Purpose |
|------|---------|
| `server/models/Workspace.js` | Mongoose schema with embedded member roles |
| `server/controllers/workspace.controller.js` | CRUD for workspaces |
| `server/controllers/workspace-members.controller.js` | Inviting, changing roles, removing members |
| `server/middleware/rbac.middleware.js` | Reusable middleware verifying roles |
| `client/src/pages/Workspaces.jsx` | Dashboard showing user's workspaces and creation form |
| `client/src/pages/WorkspaceSettings.jsx` | UI for managing members and permissions |
| `client/src/hooks/usePermissions.js` | Frontend helper hiding restricted buttons |

### How RBAC works
1. The user logs in and requests an action on a workspace.
2. The `requireWorkspaceRole` middleware intercepts the request.
3. It fetches the workspace and checks if the logged-in user is in the `members` array. If not, it returns 404.
4. It checks if the user's assigned role is included in the allowed roles for that route. If not, it returns 403.
5. If allowed, it attaches the workspace and role to the `req` object and proceeds.
6. The frontend `usePermissions` hook mimics this logic purely to hide unauthorized UI buttons.

### How to test manually
1. Log in and create a workspace. You are the Admin.
2. Click on the workspace to view Settings.
3. Create a second account in another tab. Invite that email from the Admin account.
4. Refresh the second tab. Click the workspace. You will see the Member badge and the invite/remove controls will be hidden.

### Interview Questions
**Q: Why do RBAC checks on the server if the UI hides the buttons?**
A: Because users can bypass the UI and make direct API requests using tools like Postman. The server must be the ultimate source of truth for security.

**Q: Why store roles inside the workspace document instead of the user document?**
A: Because a user can be an Admin in one workspace and a Member in another. The role is contextual to the workspace.

# TeamSync: Design and Code Rules

These rules apply to every phase. If a rule here conflicts with a new instruction,
ask me before deciding.

## Design: calm, professional, hand-designed

Reference: a clean SaaS landing page with a thin dark announcement bar, a simple top
nav, a small uppercase eyebrow label, a large plain headline with two or three words in
the accent color, a short grey paragraph, one solid primary button and one outlined
secondary button, then a framed screenshot of the real app below.

### Colors
- Page background: #FFFFFF
- Soft section background: #FAFAF8
- Borders: #E6E4DF (1px, no heavy shadows)
- Text: #14171F
- Muted text: #5B6270
- Accent (terracotta orange): #C9622F, hover #B35528
  Use the accent only for primary buttons, key headline words and active states.
- Dark strip and dark panels: #0F1522
- Success: #2F7D5B
- Danger: #B4412F

### Typography
- Inter for all UI text
- JetBrains Mono for IDs, timestamps, counts and small data labels
- Headlines: weight 700, tight letter spacing
- Body text: 15-16px
- Small uppercase eyebrow labels with wide letter spacing

### Shape and spacing
- Radius: 6px for buttons and inputs, 8px for cards
- Spacing in multiples of 4px
- Generous whitespace, simple layouts
- Icons: lucide-react only, 16px, stroke 1.5, never inside colored circles

### Strict rules to avoid an AI-generated look
- No purple or blue gradients, no glassmorphism, no glowing effects, no neon
- No emojis in the interface
- No rows of three identical feature cards with icons; vary layouts and keep sections few
- No marketing words like "seamless", "supercharge", "elevate", "unleash", "revolutionize"
- No fake testimonials, fake company logos or invented statistics
- No lorem ipsum. Use realistic data (real-sounding names, tasks like "Fix login redirect bug")
- Copy must be short, direct and specific, like a developer explaining their own product
- Every screen needs real empty states, loading states and clear error messages
- Animations: 150ms transitions on hover and drag only, nothing decorative

### Pages
Landing (hero, app preview, short "How it works", roles section), sign in and sign up,
workspace list, board (Kanban), task drawer (details and comments), chat panel,
dashboard, members and roles settings.

## Code quality: it should read like one person wrote it

- Folder structure exactly as in docs/PRD.md: client/ and server/ with routes,
  controllers, models, middleware, sockets, validators
- Descriptive names, small functions, one responsibility per file
- Consistent style, enforced by ESLint and Prettier
- Comments only where the reason is not obvious; no comment on every line
- Central error handler; input validation (Zod) on every route
- Role checks always enforced on the server, never only in the UI
- No hardcoded secrets; provide .env.example for client and server
- Optimistic UI for task moves, with rollback if the server rejects
- No unused code, no leftover console.log, no dead files
- Small, logical Git commits with plain messages (feat:, fix:, docs:)

## Working rules

- Work phase by phase as listed in docs/PRD.md
- Do not add features that are not in the PRD
- Test your own work (use two browser windows for real-time features) before
  saying a phase is done
- At the end of each phase, explain how I can test it, then stop and wait
## Keep code short and simple

- Each file does one job and stays under about 80 lines. If it grows past that, split it.
- Prefer the simplest solution. No extra abstractions, helper layers, classes or
  design patterns unless the code is repeated 3 or more times.
- Short functions (under 20 lines), short names that are still clear.
- No long comment blocks and no unused code.
- React: one small component per file, under about 100 lines. Move repeated logic into a hook.
- Express: keep controllers thin. Validation in validators/, logic in the controller,
  no duplicated try/catch (use one async error wrapper).
- Do not shorten by removing validation, security checks or error handling.
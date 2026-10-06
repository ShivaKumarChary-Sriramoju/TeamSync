import { z } from 'zod';
export const createWorkspaceSchema = z.object({ name: z.string().min(1, 'Name required') });
export const inviteMemberSchema = z.object({ email: z.string().email(), role: z.enum(['admin', 'manager', 'member']) });
export const updateRoleSchema = z.object({ role: z.enum(['admin', 'manager', 'member']) });

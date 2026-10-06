import { z } from 'zod';

export const createBoardSchema = z.object({ title: z.string().min(1) });

export const createTaskSchema = z.object({
  columnId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  labels: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  order: z.number()
});

export const moveTaskSchema = z.object({
  columnId: z.string().min(1),
  order: z.number()
});

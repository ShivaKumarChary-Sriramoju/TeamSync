import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { requireWorkspaceRole } from '../middleware/rbac.middleware.js';
import { listWorkspaces, createWorkspace, getWorkspace, deleteWorkspace } from '../controllers/workspace.controller.js';
import { inviteMember, updateRole, removeMember } from '../controllers/workspace-members.controller.js';

import { listBoards, createBoard, deleteBoard } from '../controllers/board.controller.js';
import { listTasks, createTask, moveTask, editTask } from '../controllers/task.controller.js';

const router = express.Router();
router.use(protect);

router.get('/', listWorkspaces);
router.post('/', createWorkspace);

router.get('/:id', requireWorkspaceRole(['admin', 'manager', 'member']), getWorkspace);
router.delete('/:id', requireWorkspaceRole(['admin']), deleteWorkspace);

router.post('/:id/invite', requireWorkspaceRole(['admin']), inviteMember);
router.patch('/:id/members/:uid', requireWorkspaceRole(['admin']), updateRole);
router.delete('/:id/members/:uid', requireWorkspaceRole(['admin']), removeMember);

router.get('/:id/boards', requireWorkspaceRole(['admin', 'manager', 'member']), listBoards);
router.post('/:id/boards', requireWorkspaceRole(['admin', 'manager']), createBoard);
router.delete('/:id/boards/:boardId', requireWorkspaceRole(['admin', 'manager']), deleteBoard);

router.get('/:id/boards/:boardId/tasks', requireWorkspaceRole(['admin', 'manager', 'member']), listTasks);
router.post('/:id/boards/:boardId/tasks', requireWorkspaceRole(['admin', 'manager']), createTask);
router.patch('/:id/boards/:boardId/tasks/:taskId/move', requireWorkspaceRole(['admin', 'manager', 'member']), moveTask);
router.patch('/:id/boards/:boardId/tasks/:taskId', requireWorkspaceRole(['admin', 'manager', 'member']), editTask);

export default router;

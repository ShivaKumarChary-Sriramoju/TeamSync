import Workspace from '../models/Workspace.js';
import { createWorkspaceSchema } from '../validators/workspace.validator.js';

export const listWorkspaces = async (req, res) => {
  const workspaces = await Workspace.find({ 'members.userId': req.user._id });
  res.json(workspaces);
};

export const createWorkspace = async (req, res) => {
  try {
    const { name } = createWorkspaceSchema.parse(req.body);
    const workspace = await Workspace.create({
      name, ownerId: req.user._id, members: [{ userId: req.user._id, role: 'admin' }]
    });
    res.status(201).json(workspace);
  } catch(e) { res.status(400).json({ message: 'Invalid data' }); }
};

export const getWorkspace = async (req, res) => {
  await req.workspace.populate('members.userId', 'name email avatar');
  res.json(req.workspace);
};

export const deleteWorkspace = async (req, res) => {
  await Workspace.findByIdAndDelete(req.workspace._id);
  res.json({ message: 'Workspace deleted' });
};

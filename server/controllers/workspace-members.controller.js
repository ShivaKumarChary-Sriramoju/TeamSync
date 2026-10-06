import User from '../models/User.js';
import { inviteMemberSchema, updateRoleSchema } from '../validators/workspace.validator.js';

const isLastAdmin = (workspace, userId, newRole = null) => {
  const admins = workspace.members.filter(m => m.role === 'admin');
  return admins.length === 1 && admins[0].userId.toString() === userId.toString() && newRole !== 'admin';
};

export const inviteMember = async (req, res) => {
  try {
    const { email, role } = inviteMemberSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found. Must have an account.' });
    if (req.workspace.members.some(m => m.userId.toString() === user._id.toString())) {
      return res.status(400).json({ message: 'User already in workspace' });
    }
    req.workspace.members.push({ userId: user._id, role });
    await req.workspace.save();
    res.status(201).json(req.workspace);
  } catch(e) { res.status(400).json({ message: 'Invalid data' }); }
};

export const updateRole = async (req, res) => {
  try {
    const { role } = updateRoleSchema.parse(req.body);
    const { uid } = req.params;
    if (isLastAdmin(req.workspace, uid, role)) return res.status(400).json({ message: 'Cannot demote the last admin' });
    const member = req.workspace.members.find(m => m.userId.toString() === uid);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    member.role = role;
    await req.workspace.save();
    res.json(req.workspace);
  } catch(e) { res.status(400).json({ message: 'Invalid data' }); }
};

export const removeMember = async (req, res) => {
  const { uid } = req.params;
  if (isLastAdmin(req.workspace, uid)) return res.status(400).json({ message: 'Cannot remove the last admin' });
  req.workspace.members = req.workspace.members.filter(m => m.userId.toString() !== uid);
  await req.workspace.save();
  res.json(req.workspace);
};

import Workspace from '../models/Workspace.js';

export const requireWorkspaceRole = (roles = ['admin', 'manager', 'member']) => async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    
    const member = workspace.members.find(m => m.userId.toString() === req.user._id.toString());
    if (!member) return res.status(404).json({ message: 'Workspace not found' });
    
    if (!roles.includes(member.role)) return res.status(403).json({ message: 'Forbidden' });
    
    req.workspace = workspace;
    req.memberRole = member.role;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

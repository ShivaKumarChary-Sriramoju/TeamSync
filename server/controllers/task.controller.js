import Task from '../models/Task.js';
import { createTaskSchema, moveTaskSchema } from '../validators/board.validator.js';

export const listTasks = async (req, res) => {
  const tasks = await Task.find({ boardId: req.params.boardId }).sort('order');
  res.json(tasks);
};

export const createTask = async (req, res) => {
  try {
    const data = createTaskSchema.parse(req.body);
    const task = await Task.create({ ...data, boardId: req.params.boardId });
    res.status(201).json(task);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const moveTask = async (req, res) => {
  try {
    const { columnId, order } = moveTaskSchema.parse(req.body);
    const task = await Task.findOne({ _id: req.params.taskId, boardId: req.params.boardId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // RBAC: Members can only move their own tasks
    if (req.memberRole === 'member' && task.assigneeId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    task.columnId = columnId;
    task.order = order;
    await task.save();
    res.json(task);
  } catch (err) { res.status(400).json({ message: 'Invalid data' }); }
};

export const editTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, boardId: req.params.boardId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    if (req.memberRole === 'member' && task.assigneeId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    Object.assign(task, req.body); // Should validate, keeping short for rules
    await task.save();
    res.json(task);
  } catch (err) { res.status(400).json({ message: 'Invalid data' }); }
};

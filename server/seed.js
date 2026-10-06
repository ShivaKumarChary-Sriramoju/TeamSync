import mongoose from 'mongoose';
import User from './models/User.js';
import Workspace from './models/Workspace.js';
import Board from './models/Board.js';
import Task from './models/Task.js';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});
  await Workspace.deleteMany({});
  await Board.deleteMany({});
  await Task.deleteMany({});

  const shiva = await User.create({ name: 'Shiva', email: 'shiva@example.com', passwordHash: 'Demo@1234' });
  const ravi = await User.create({ name: 'Ravi', email: 'ravi@example.com', passwordHash: 'Demo@1234' });
  const sai = await User.create({ name: 'Sai', email: 'sai@example.com', passwordHash: 'Demo@1234' });

  const ws = await Workspace.create({
    name: 'College Project', ownerId: shiva._id,
    members: [
      { userId: shiva._id, role: 'admin' },
      { userId: ravi._id, role: 'manager' },
      { userId: sai._id, role: 'member' }
    ]
  });

  const columns = [
    { id: 'todo', name: 'To Do', order: 0 },
    { id: 'inprogress', name: 'In Progress', order: 1 },
    { id: 'done', name: 'Done', order: 2 }
  ];
  const board = await Board.create({ workspaceId: ws._id, title: 'Main Board', columns });

  for (let i = 0; i < 12; i++) {
    await Task.create({
      boardId: board._id, columnId: ['todo', 'inprogress', 'done'][i % 3],
      title: `Task ${i+1}`, description: 'Description',
      assigneeId: [shiva._id, ravi._id, sai._id][i % 3],
      priority: ['low', 'medium', 'high'][i % 3], order: i
    });
  }

  console.log('Seed complete!');
  process.exit();
}
seed();

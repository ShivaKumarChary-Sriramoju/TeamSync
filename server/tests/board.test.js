import request from 'supertest';
import { app } from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import Board from '../models/Board.js';
import Task from '../models/Task.js';
import jwt from 'jsonwebtoken';

const getToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });

describe('Board & Task Tests', () => {
  let shiva, ravi, sai, ws, shivaToken, raviToken, saiToken, board, taskSai, taskRavi;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({});
    await Workspace.deleteMany({});
    await Board.deleteMany({});
    await Task.deleteMany({});
    
    shiva = await User.create({ name: 'Shiva', email: 'shiva@e.com', passwordHash: 'pwd' });
    ravi = await User.create({ name: 'Ravi', email: 'ravi@e.com', passwordHash: 'pwd' });
    sai = await User.create({ name: 'Sai', email: 'sai@e.com', passwordHash: 'pwd' });
    
    shivaToken = getToken(shiva._id);
    raviToken = getToken(ravi._id);
    saiToken = getToken(sai._id);
    
    ws = await Workspace.create({
      name: 'Test WS', ownerId: shiva._id,
      members: [{ userId: shiva._id, role: 'admin' }, { userId: ravi._id, role: 'manager' }, { userId: sai._id, role: 'member' }]
    });

    board = await Board.create({ workspaceId: ws._id, title: 'B1', columns: [{ id: 'c1', name: 'C1', order: 0 }] });
    taskSai = await Task.create({ boardId: board._id, columnId: 'c1', title: 'T1', order: 0, assigneeId: sai._id });
    taskRavi = await Task.create({ boardId: board._id, columnId: 'c1', title: 'T2', order: 1, assigneeId: ravi._id });
  });

  afterAll(async () => await mongoose.disconnect());

  it('Members cannot create boards or tasks', async () => {
    const bRes = await request(app).post(`/api/workspaces/${ws._id}/boards`).set('Authorization', `Bearer ${saiToken}`).send({ title: 'New' });
    expect(bRes.statusCode).toBe(403);
    const tRes = await request(app).post(`/api/workspaces/${ws._id}/boards/${board._id}/tasks`).set('Authorization', `Bearer ${saiToken}`).send({ columnId: 'c1', title: 'New', order: 2 });
    expect(tRes.statusCode).toBe(403);
  });

  it('Members can edit and move ONLY their assigned tasks', async () => {
    const moveOwn = await request(app).patch(`/api/workspaces/${ws._id}/boards/${board._id}/tasks/${taskSai._id}/move`).set('Authorization', `Bearer ${saiToken}`).send({ columnId: 'c2', order: 1 });
    expect(moveOwn.statusCode).toBe(200);

    const moveOther = await request(app).patch(`/api/workspaces/${ws._id}/boards/${board._id}/tasks/${taskRavi._id}/move`).set('Authorization', `Bearer ${saiToken}`).send({ columnId: 'c2', order: 1 });
    expect(moveOther.statusCode).toBe(403);
  });

  it('Managers can create boards and tasks', async () => {
    const tRes = await request(app).post(`/api/workspaces/${ws._id}/boards/${board._id}/tasks`).set('Authorization', `Bearer ${raviToken}`).send({ columnId: 'c1', title: 'New', order: 2 });
    expect(tRes.statusCode).toBe(201);
  });
});

import request from 'supertest';
import { app } from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import jwt from 'jsonwebtoken';

const getToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });

describe('Workspace RBAC Tests', () => {
  let shiva, ravi, sai, outsider, workspace, shivaToken, raviToken, saiToken, outsiderToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({});
    await Workspace.deleteMany({});
    
    shiva = await User.create({ name: 'Shiva', email: 'shiva@example.com', passwordHash: 'pwd' });
    ravi = await User.create({ name: 'Ravi', email: 'ravi@example.com', passwordHash: 'pwd' });
    sai = await User.create({ name: 'Sai', email: 'sai@example.com', passwordHash: 'pwd' });
    outsider = await User.create({ name: 'Out', email: 'out@example.com', passwordHash: 'pwd' });

    shivaToken = getToken(shiva._id);
    raviToken = getToken(ravi._id);
    saiToken = getToken(sai._id);
    outsiderToken = getToken(outsider._id);

    workspace = await Workspace.create({
      name: 'Test WS', ownerId: shiva._id,
      members: [
        { userId: shiva._id, role: 'admin' },
        { userId: ravi._id, role: 'manager' },
        { userId: sai._id, role: 'member' }
      ]
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('Non-member gets 404 on workspace actions', async () => {
    const res = await request(app).get(`/api/workspaces/${workspace._id}`).set('Authorization', `Bearer ${outsiderToken}`);
    expect(res.statusCode).toBe(404);
  });

  it('Manager gets 403 on admin-only actions (invite, change role, remove, delete)', async () => {
    const inviteRes = await request(app).post(`/api/workspaces/${workspace._id}/invite`).set('Authorization', `Bearer ${raviToken}`).send({ email: outsider.email, role: 'member' });
    expect(inviteRes.statusCode).toBe(403);
    
    const delRes = await request(app).delete(`/api/workspaces/${workspace._id}`).set('Authorization', `Bearer ${raviToken}`);
    expect(delRes.statusCode).toBe(403);
  });

  it('Member gets 403 on admin actions', async () => {
    const res = await request(app).delete(`/api/workspaces/${workspace._id}/members/${ravi._id}`).set('Authorization', `Bearer ${saiToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('Last admin rule works', async () => {
    const demoteRes = await request(app).patch(`/api/workspaces/${workspace._id}/members/${shiva._id}`).set('Authorization', `Bearer ${shivaToken}`).send({ role: 'member' });
    expect(demoteRes.statusCode).toBe(400);

    const rmRes = await request(app).delete(`/api/workspaces/${workspace._id}/members/${shiva._id}`).set('Authorization', `Bearer ${shivaToken}`);
    expect(rmRes.statusCode).toBe(400);
  });

  it('Admin can successfully invite and change roles', async () => {
    const invite = await request(app).post(`/api/workspaces/${workspace._id}/invite`).set('Authorization', `Bearer ${shivaToken}`).send({ email: outsider.email, role: 'member' });
    expect(invite.statusCode).toBe(201);
    
    const patch = await request(app).patch(`/api/workspaces/${workspace._id}/members/${outsider._id}`).set('Authorization', `Bearer ${shivaToken}`).send({ role: 'manager' });
    expect(patch.statusCode).toBe(200);
  });
});

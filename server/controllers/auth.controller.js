import User from '../models/User.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import jwt from 'jsonwebtoken';

const genTokens = (id) => ({
  accessToken: jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' }),
  refreshToken: jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
});

const setCookie = (res, token) => res.cookie('refreshToken', token, {
  httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 604800000
});

const handleErr = (res, err) => {
  if (err.name === 'ZodError') return res.status(400).json({ message: err.errors[0].message });
  res.status(500).json({ message: 'Server error' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, passwordHash: password });
    const { accessToken, refreshToken } = genTokens(user._id);
    setCookie(res, refreshToken);
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar, accessToken });
  } catch (err) { handleErr(res, err); }
};

export const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    const { accessToken, refreshToken } = genTokens(user._id);
    setCookie(res, refreshToken);
    res.json({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar, accessToken });
  } catch (err) { handleErr(res, err); }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (!(await User.findById(decoded.id))) return res.status(401).json({ message: 'User not found' });
    const tokens = genTokens(decoded.id);
    setCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken });
  } catch (err) { res.status(401).json({ message: 'Invalid token' }); }
};

export const logout = (req, res) => {
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out successfully' });
};

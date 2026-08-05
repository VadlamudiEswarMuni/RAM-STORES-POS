import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role_name },
    process.env.JWT_SECRET || 'change_this_to_a_secure_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const rows = await query(
      `SELECT u.*, r.name AS role_name FROM users u JOIN roles r ON r.id = u.role_id WHERE u.email = ?`,
      [email]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'This account is not active.' });
    }

    const token = generateToken(user);

    await query(`UPDATE users SET last_login = NOW() WHERE id = ?`, [user.id]);

    const { password_hash, ...userInfo } = user;

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: { ...userInfo, password_hash: undefined },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const { user } = req;
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await query(`
      SELECT u.id, u.full_name, u.email, u.phone, u.status, r.name AS role_name, u.last_login, u.created_at
      FROM users u
      JOIN roles r ON r.id = u.role_id
      ORDER BY u.created_at DESC
    `);

    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/firebase';
import { User } from '../types';

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Check if email already exists
    const existing = await db.collection('users').where('email', '==', email).get();
    if (!existing.empty) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user',
      createdAt: undefined,
    };

    const docRef = await db.collection('users').add({
      ...newUser,
      createdAt: new Date(),
    });

    const token = jwt.sign(
      { uid: docRef.id, email, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN as any) }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: docRef.id, name, email, role: newUser.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data() as User;

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { uid: userDoc.id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN as any) }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// GET /api/auth/me
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userDoc = await db.collection('users').doc(req.user!.uid).get();
    if (!userDoc.exists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const data = userDoc.data() as User;
    res.json({
      id: userDoc.id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import User from '../../models/User';
import connectDB from '../../utils/mongoose';
import authenticateUser from '../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Authenticate the user
    connectDB();
    try {
      const token = await authenticateUser({ email, password });
      res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } else {
    res.status(405).send({ message: 'Method not allowed' });
  }
}

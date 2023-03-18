import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface ILoginData {
  email: string;
  password: string;
}

const authenticateUser = async ({ email, password }: ILoginData) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
  return token;
};

export default authenticateUser;

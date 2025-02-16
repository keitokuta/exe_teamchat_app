import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, UserModel } from '../models/user.model';
import { config } from '../config';

export class AuthService {
  private readonly JWT_SECRET = config.jwt.secret;
  private readonly JWT_EXPIRES_IN = '24h';

  async register(email: string, password: string, name: string): Promise<User> {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    });

    return user;
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = this.generateToken(user);
    return { token, user };
  }

  private generateToken(user: User): string {
    return sign(
      {
        userId: user._id,
        email: user.email,
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const decoded = verify(token, this.JWT_SECRET) as { userId: string };
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
  }
}

export const authService = new AuthService();
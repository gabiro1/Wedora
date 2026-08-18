import prisma from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/helpers.js";
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from "../utils/token.js";
import { UnauthorizedError, ConflictError, NotFoundError } from "../utils/errors.js";

class AuthService {
  async register(data) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictError("Email already registered");

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: { email: data.email, passwordHash, firstName: data.firstName, lastName: data.lastName, phone: data.phone },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    });

    const tokens = await this.#generateTokens(user.id, user.email, user.role);
    return { user, ...tokens };
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedError("Invalid credentials");
    if (!user.isActive) throw new UnauthorizedError("Account is deactivated");

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError("Invalid credentials");

    const tokens = await this.#generateTokens(user.id, user.email, user.role);
    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      ...tokens,
    };
  }

  async refresh(refreshToken) {
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date()) throw new UnauthorizedError("Invalid or expired refresh token");

    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const tokens = await this.#generateTokens(stored.user.id, stored.user.email, stored.user.role);
    return {
      user: { id: stored.user.id, email: stored.user.email, firstName: stored.user.firstName, lastName: stored.user.lastName, role: stored.user.role },
      ...tokens,
    };
  }

  async logout(refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, role: true, createdAt: true },
    });
    if (!user) throw new NotFoundError("User");
    return user;
  }

  async #generateTokens(userId, email, role) {
    const accessToken = generateAccessToken({ userId, email, role });
    const refreshToken = generateRefreshToken();
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt: getRefreshTokenExpiry() },
    });
    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();

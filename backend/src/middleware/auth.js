import { verifyAccessToken } from "../utils/token.js";
import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";
import prisma from "../config/db.js";

export const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new UnauthorizedError();

    const token = header.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.isActive) throw new UnauthorizedError("Account not found or deactivated");

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) return next(error);
    next(new UnauthorizedError("Invalid token"));
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new UnauthorizedError());
  if (!roles.includes(req.user.role)) return next(new ForbiddenError());
  next();
};

export const authorizeWedding = (...weddingRoles) => async (req, _res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const weddingId = req.params.weddingId || req.body.weddingId || req.query.weddingId;
    if (!weddingId) throw new ForbiddenError("Wedding context required");

    const membership = await prisma.weddingMember.findUnique({
      where: { userId_weddingId: { userId: req.user.userId, weddingId } },
    });

    if (!membership) throw new ForbiddenError("Not a member of this wedding");
    if (weddingRoles.length > 0 && !weddingRoles.includes(membership.role)) {
      throw new ForbiddenError("Insufficient role for this wedding");
    }

    req.weddingId = weddingId;
    next();
  } catch (error) {
    if (error instanceof ForbiddenError || error instanceof UnauthorizedError) return next(error);
    next(new ForbiddenError());
  }
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
      req.user = verifyAccessToken(header.split(" ")[1]);
    }
  } catch { /* optional */ }
  next();
};

import { Request, Response, NextFunction } from 'express';

import UserType from '../models/user-type.model';
import { NotFoundError } from '../middlewares/error.middlewere';

// Simple in-memory cache (consider Redis for production)
const userTypeCache = new Map<string, { type: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get user type by userId (with caching)
 */
export async function getUserType(userId: string): Promise<string> {
  // Check cache first
  const cached = userTypeCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.type;
  }

  // Query database
  const userType = await UserType.findOne({ userId });
  if (!userType) throw new NotFoundError('User type not found');

  // Update cache
  userTypeCache.set(userId, { type: userType.type, timestamp: Date.now() });

  return userType.type;
}

/**
 * Validate that a user has the expected type
 */
export async function validateUserType(
  userId: string,
  expectedType: 'student' | 'agent' | 'admin'
): Promise<boolean> {
  const userType = await getUserType(userId);
  return userType === expectedType;
}

/**
 * Middleware to require a specific user type
 */
export function requireUserType(expectedType: 'student' | 'agent' | 'admin') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as { id: string } | undefined;
      if (!user || !user.id) {
        return res.status(401).json({ error: 'Unauthorized, user not found' });
      }

      const isValid = await validateUserType(user.id, expectedType);
      if (!isValid) {
        return res.status(403).json({
          error: `Access denied. Required user type: ${expectedType}`,
        });
      }

      next();
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Clear cache for a specific user (useful when user type changes)
 */
export function clearUserTypeCache(userId: string): void {
  userTypeCache.delete(userId);
}

/**
 * Clear all cache (useful for testing or cache invalidation)
 */
export function clearAllUserTypeCache(): void {
  userTypeCache.clear();
}

import { prisma } from '../config/prisma.js';

export class AuditService {
  static async log(
    data: {
      userId?: string;
      action: string;
      entityType?: string;
      entityId?: string;
      ipAddress?: string;
      metadata?: any;
    }
  ) {
    return prisma.auditLog.create({
      data,
    });
  }
}
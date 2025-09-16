import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '@backend/src/database/drizzle.service';
import { refreshTokens } from '@backend/src/database/schema/refreshTokens.schema';
import { hash as argon2Hash, verify as argon2Verify } from '@node-rs/argon2'; // or argon2

@Injectable()
export class RefreshTokensRepository {
  constructor(private readonly db: DrizzleService) {}

  async create(userId: number, rawToken: string, expiresAt: Date, ip?: string, ua?: string) {
    const tokenHash = await argon2Hash(rawToken);
    // Generate a random id (for demo, use timestamp + random)
    const id = Date.now() + Math.floor(Math.random() * 10000);
    await this.db.db.insert(refreshTokens).values({
      id,
      userId,
      tokenHash,
      revoked: false,
      expiresAt,
      createdAt: new Date(),
      createdByIp: ip,
 
    });
  }

  async revokeById(id: number) {
    await this.db.db.update(refreshTokens).set({ revoked: true }).where(eq(refreshTokens.id, id));
  }

  async revokeAllByUser(userId: number) {
    await this.db.db.update(refreshTokens).set({ revoked: true }).where(eq(refreshTokens.userId, userId));
  }

  async findValidByUser(userId: number) {
    return this.db.db.select().from(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  // NEW: do the hash comparison here so controller doesn’t import argon2
  async findMatchingIdForUser(userId: number, rawToken: string): Promise<number | null> {
    const rows = await this.findValidByUser(userId);
    for (const row of rows) {
      if (row.revoked || row.expiresAt < new Date()) continue;
      if (row.tokenHash && await argon2Verify(row.tokenHash, rawToken)) return row.id;
    }
    return null;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from '@backend/src/configurations/configs/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';

import { oauth_identities } from '@backend/src/database/schema/oauthIdentities.schema';
import { users } from '@backend/src/database/schema/users.schema';

import { UsersRepository } from '@backend/src/modules/users.repository';

type UpsertOAuthArgs = {
  provider: 'github';
  subject: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

@Injectable()
export class AuthService {
    private db;

    constructor(
        private jwtService: JwtService,
        @Inject(refreshJwtConfig.KEY) private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
        private readonly usersRepo: UsersRepository,
        private readonly pool: Pool,
    ) {
        this.db = drizzle(this.pool,{schema: {oauth_identities, users}});
    }

    signJwt(userId: number) {
        const payload = { sub: userId };
        const accessToken = this.jwtService.sign(payload);
        return accessToken;
    }

    signRefreshJwt(userId: number) {
        const payload = { sub: userId  };
        const refreshToken = this.jwtService.sign(payload, this.refreshJwtConfiguration);
        return refreshToken;
    }
    
    async upsertOAuthUser(args: UpsertOAuthArgs) {
        const [identity] = await this.db
            .select()
            .from(oauth_identities)
            .where(
                and(
                eq(oauth_identities.provider, args.provider),
                eq(oauth_identities.subject, args.subject),
                ),
            )
            .limit(1);

        if (identity) {
            const user = await this.usersRepo.findById(identity.userId);
            if (!user) throw new Error('Orphaned oauth identity: linked user not found');
            return user;
        }

        return await this.db.transaction(async (tx) => {
        // create a minimal, valid user row (only required columns)
        const newUser = await this.usersRepo.createUserFromOAuthTx(tx, {
            email: args.email ?? null,
            firstName: args.firstName ?? null,
            lastName: args.lastName ?? null,
        });

        await tx.insert(oauth_identities).values({
            userId: newUser.userId,
            provider: args.provider,
            subject: args.subject,
            email: args.email ?? null,
            emailVerified: null,     // keep null until  implement verification
            createdAt: new Date(),   // required (schema has NOT NULL, no default)
        });

        return newUser;
        });
    }
}

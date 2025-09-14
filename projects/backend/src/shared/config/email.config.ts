import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const emailConfigSchema = z.object({
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().default('587'),
  SMTP_SECURE: z.string().default('false'),
  // SMTP_USER: z.string().min(1),
  // SMTP_PASSWORD: z.string().min(1),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASSWORD: z.string().optional().default(''),
  EMAIL_FROM: z.string().email(),
  EMAIL_FROM_NAME: z.string().default('Rocket XP'),
});

export interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth?: { user: string; pass: string };
    ignoreTLS?: boolean;
    tls?: { rejectUnauthorized: boolean };
  };
  from: {
    address: string;
    name: string;
  };
}

// export default registerAs(
//   'email',
//   (): EmailConfig => ({
//     smtp: {
//       host: process.env.SMTP_HOST || 'smtp.gmail.com',
//       port: parseInt(process.env.SMTP_PORT || '587'),
//       secure: process.env.SMTP_SECURE === 'true',
//       auth: {
//         user: process.env.SMTP_USER!,
//         pass: process.env.SMTP_PASSWORD!,
//       },
//     },
//     from: {
//       address: process.env.EMAIL_FROM!,
//       name: process.env.EMAIL_FROM_NAME || 'WeGoEveryWhere',
//     },
//   }),
// );
export default registerAs('email', (): EmailConfig => {
  const host = process.env.SMTP_HOST!;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASSWORD || '';

  const isMailhog = host === 'mailhog' && port === 1025;

  return {
    smtp: {
      host,
      port,
      secure,
      ...(isMailhog
        ? { ignoreTLS: true, tls: { rejectUnauthorized: false } }
        : user && pass
          ? { auth: { user, pass } }
          : {}),
    },
    from: {
      address: process.env.EMAIL_FROM!,
      name: process.env.EMAIL_FROM_NAME || 'WeGoEveryWhere',
    },
  };
});

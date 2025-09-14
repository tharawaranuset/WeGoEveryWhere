import { admin } from './admin.schema';
import { authUsers } from './authUsers.schema';
import { beFriend } from './beFriend.schema';
import { chat } from './chat.schema';
import { chatDoc } from './chatDoc.schema';
import { event } from './event.schema';
import { joined } from './joined.schema';
import { oauthIdentities } from './oauthIdentities.schema';
import { participant } from './participant.schema';
import { refreshTokens } from './refreshTokens.schema';
import { report } from './report.schema';
import { users } from './users.schema';

// Add more imports if you add more tables

export const schema = {
  admin,
  authUsers,
  beFriend,
  chat,
  chatDoc,
  event,
  joined,
  oauthIdentities,
  participant,
  refreshTokens,
  report,
  users,
};

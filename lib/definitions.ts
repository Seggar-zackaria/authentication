export type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  role?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  accounts?: Account[] | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  user?: User;
};

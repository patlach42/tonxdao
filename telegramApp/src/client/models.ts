export type Body_login_login_access_token = {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
};

export type CentrifugoTokenResponse = {
  token: string;
};

export type HTTPValidationError = {
  detail?: Array<ValidationError>;
};

export type ReferrerUser = {
  name: string;
  id: string;
};

export type ReferrersResponse = {
  list: Array<ReferrerUser>;
  link: string;
};

export type TelegramInitData = {
  initData: string;
};

export type Token = {
  access_token: string;
  token_type?: string;
};

export type UserPublic = {
  email: string;
  telegram_id: string;
  is_active?: boolean;
  is_superuser?: boolean;
  full_name?: string | null;
  coins?: number;
  id: number;
};

export type ValidationError = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};

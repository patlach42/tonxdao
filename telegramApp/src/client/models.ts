export type Body_login_login_access_token = {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
};

export type BoostEnum = "energy";

export type BoostRequest = {
  slug: BoostEnum;
};

export type BoostResponse = {
  slug: BoostEnum;
};

export type CentrifugoRpc = {
  user: string;
  method: CentrifugoRpcMethod;
  data: Record<string, unknown>;
};

export type CentrifugoRpcMethod = "on_connected" | "tap";

export type CentrifugoTokenResponse = {
  token: string;
};

export type HTTPValidationError = {
  detail?: Array<ValidationError>;
};

export type ReferrerUser = {
  name: string;
  coins: number;
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
  energy: number;
  last_energy_change: number;
  referral_link: string;
  level_caps: Array<number>;
};

export type ValidationError = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};

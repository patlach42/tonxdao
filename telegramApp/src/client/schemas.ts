export const $Body_login_login_access_token = {
  properties: {
    grant_type: {
      type: "any-of",
      contains: [
        {
          type: "string",
          pattern: "password",
        },
        {
          type: "null",
        },
      ],
    },
    username: {
      type: "string",
      isRequired: true,
    },
    password: {
      type: "string",
      isRequired: true,
    },
    scope: {
      type: "string",
      default: "",
    },
    client_id: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    client_secret: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $BoostEnum = {
  type: '"energy"',
} as const;

export const $BoostRequest = {
  properties: {
    slug: {
      type: "BoostEnum",
      isRequired: true,
    },
  },
} as const;

export const $BoostResponse = {
  properties: {
    slug: {
      type: "BoostEnum",
      isRequired: true,
    },
  },
} as const;

export const $CentrifugoRpc = {
  properties: {
    user: {
      type: "string",
      isRequired: true,
    },
    method: {
      type: "CentrifugoRpcMethod",
      isRequired: true,
    },
    data: {
      type: "dictionary",
      contains: {
        properties: {},
      },
      isRequired: true,
    },
  },
} as const;

export const $CentrifugoRpcMethod = {
  type: "Enum",
  enum: ["on_connected", "tap"],
} as const;

export const $CentrifugoTokenResponse = {
  properties: {
    token: {
      type: "string",
      isRequired: true,
    },
  },
} as const;

export const $HTTPValidationError = {
  properties: {
    detail: {
      type: "array",
      contains: {
        type: "ValidationError",
      },
    },
  },
} as const;

export const $ReferrerUser = {
  properties: {
    name: {
      type: "string",
      isRequired: true,
    },
    coins: {
      type: "number",
      isRequired: true,
    },
    id: {
      type: "string",
      isRequired: true,
    },
  },
} as const;

export const $ReferrersResponse = {
  properties: {
    list: {
      type: "array",
      contains: {
        type: "ReferrerUser",
      },
      isRequired: true,
    },
    link: {
      type: "string",
      isRequired: true,
    },
  },
} as const;

export const $TelegramInitData = {
  properties: {
    initData: {
      type: "string",
      isRequired: true,
    },
  },
} as const;

export const $Token = {
  properties: {
    access_token: {
      type: "string",
      isRequired: true,
    },
    token_type: {
      type: "string",
      default: "bearer",
    },
  },
} as const;

export const $UserPublic = {
  properties: {
    email: {
      type: "string",
      isRequired: true,
    },
    telegram_id: {
      type: "string",
      isRequired: true,
    },
    is_active: {
      type: "boolean",
      default: true,
    },
    is_superuser: {
      type: "boolean",
      default: false,
    },
    full_name: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    coins: {
      type: "number",
      default: 0,
    },
    id: {
      type: "number",
      isRequired: true,
    },
    energy: {
      type: "number",
      isRequired: true,
    },
    last_energy_change: {
      type: "number",
      isRequired: true,
    },
  },
} as const;

export const $ValidationError = {
  properties: {
    loc: {
      type: "array",
      contains: {
        type: "any-of",
        contains: [
          {
            type: "string",
          },
          {
            type: "number",
          },
        ],
      },
      isRequired: true,
    },
    msg: {
      type: "string",
      isRequired: true,
    },
    type: {
      type: "string",
      isRequired: true,
    },
  },
} as const;

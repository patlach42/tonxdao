import type { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";

import type {
  Body_login_login_access_token,
  CentrifugoTokenResponse,
  TelegramInitData,
  Token,
  UserPublic,
  CentrifugoRpc,
  ReferrersResponse,
  BoostRequest,
  BoostResponse,
} from "./models";

export type LoginData = {
  LoginLoginTelegramWebApp: {
    requestBody: TelegramInitData;
  };
  LoginLoginAccessToken: {
    formData: Body_login_login_access_token;
  };
};

export type CenrifugoData = {
  CenrifugoRpc: {
    requestBody: CentrifugoRpc;
  };
  CenrifugoPub: {
    requestBody: Record<string, unknown>;
  };
};

export type ReferrersData = {};

export type BoostsData = {
  BoostsBoost: {
    requestBody: BoostRequest;
  };
};

export class LoginService {
  /**
   * Login Telegram Web App
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static loginLoginTelegramWebApp(
    data: LoginData["LoginLoginTelegramWebApp"],
  ): CancelablePromise<Token> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/web-app",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Login Access Token
   * OAuth2 compatible token login, get an access token for future requests
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static loginLoginAccessToken(
    data: LoginData["LoginLoginAccessToken"],
  ): CancelablePromise<Token> {
    const { formData } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/access-token",
      formData: formData,
      mediaType: "application/x-www-form-urlencoded",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Test Token
   * Test access token
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static loginTestToken(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/test-token",
    });
  }

  /**
   * Centrifugo Token
   * @returns CentrifugoTokenResponse Successful Response
   * @throws ApiError
   */
  public static loginCentrifugoToken(): CancelablePromise<CentrifugoTokenResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/centrifugo-token",
    });
  }

  /**
   * Profile
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static loginProfile(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/profile",
    });
  }
}

export class CenrifugoService {
  /**
   * Rpc
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static cenrifugoRpc(
    data: CenrifugoData["CenrifugoRpc"],
  ): CancelablePromise<Record<string, unknown>> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/rpc",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Pub
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static cenrifugoPub(
    data: CenrifugoData["CenrifugoPub"],
  ): CancelablePromise<Record<string, unknown>> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/pub",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class ReferrersService {
  /**
   * Referrers
   * @returns ReferrersResponse Successful Response
   * @throws ApiError
   */
  public static referrersReferrers(): CancelablePromise<ReferrersResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/referrers",
    });
  }
}

export class BoostsService {
  /**
   * Boost
   * @returns BoostResponse Successful Response
   * @throws ApiError
   */
  public static boostsBoost(
    data: BoostsData["BoostsBoost"],
  ): CancelablePromise<BoostResponse> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/boost",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export const AUTH_COOKIES = {
  accessToken: "ap_access_token",
  refreshToken: "ap_refresh_token",
} as const;

export const ACCESS_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export type AuthCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge: number;
};

export function getAuthCookieOptions(
  maxAge: number,
  isProduction: boolean,
): AuthCookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

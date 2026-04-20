export type LoginInput = {
  phone: string;
  password: string;
};

export type LoginFailure = {
  ok: false;
  status: 401 | 403 | 502;
  message: string;
};

export type LoginSuccess = {
  ok: true;
  accessToken: string;
  refreshToken?: string;
};

export type LoginResult = LoginFailure | LoginSuccess;

export type RefreshInput = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
};

export type LogoutInput = RefreshInput;

export interface AuthAdapter {
  login(input: LoginInput): Promise<LoginResult>;
  refresh(input: RefreshInput): Promise<LoginResult>;
  logout(input: LogoutInput): Promise<void>;
}

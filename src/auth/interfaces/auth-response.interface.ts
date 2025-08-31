export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: any[];
  };
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    username: string;
    roles: any[];
  };
}

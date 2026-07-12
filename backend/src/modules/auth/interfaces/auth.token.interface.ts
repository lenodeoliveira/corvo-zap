export interface IAuthToken {
  generateToken(payload: Record<string, unknown>): string;
  verifyToken(token: string): unknown;
}

export interface IAuthToken<T> {
  generateToken(payload: T): string;
  verifyToken(token: string): T;
}

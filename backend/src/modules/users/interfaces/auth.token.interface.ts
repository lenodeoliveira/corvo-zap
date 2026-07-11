export interface IAuthToken {
    generateToken(payload: any): string;
    verifyToken(token: string): any;
}
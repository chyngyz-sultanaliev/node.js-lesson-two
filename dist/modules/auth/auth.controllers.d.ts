import { Request, Response } from "express";
interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}
interface ResetToken {
    token: string;
    userId: string;
    expires: number;
}
export declare const users: User[];
export declare const resetTokens: ResetToken[];
export declare const signup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const signin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const requestResetPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyResetCode: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const resetPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=auth.controllers.d.ts.map
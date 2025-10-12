export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}
export declare const users: User[];
export declare const createUser: (username: string, email: string, password: string) => Promise<User>;
//# sourceMappingURL=userModel.d.ts.map
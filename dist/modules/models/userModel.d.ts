interface User {
    id: string;
    username: string;
    password: string;
}
export declare const users: User[];
export declare const createUser: (username: string, password: string) => Promise<User>;
export {};
//# sourceMappingURL=userModel.d.ts.map
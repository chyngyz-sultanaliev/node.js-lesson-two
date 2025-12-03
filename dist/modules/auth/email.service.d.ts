interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}
export declare const sendEmail: ({ to, subject, text, html }: EmailOptions) => Promise<import("resend").CreateEmailResponse>;
export {};
//# sourceMappingURL=email.service.d.ts.map
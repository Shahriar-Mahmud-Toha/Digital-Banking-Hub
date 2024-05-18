export declare class UserEmailService {
    private transporter;
    constructor();
    sendMail(to: string, subject: string, text: string): Promise<void>;
}

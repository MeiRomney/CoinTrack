export type SendEmailParams = {
    eventType: string;
    data: Record<string, any>;
};
export type SendEmailResult = {
    success: boolean;
    sent?: number;
    errors?: number;
};
/**
 * Send a transactional email directly via the email service REST API.
 * Falls back to a warning if EMAIL_SERVICE_URL is not configured.
 */
export declare function sendEmail(params: SendEmailParams): Promise<SendEmailResult>;
//# sourceMappingURL=emailClient.d.ts.map
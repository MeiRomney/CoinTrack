import axios from "axios";
import { createLogger } from "./logger.js";
const logger = createLogger();
const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL;
/**
 * Send a transactional email directly via the email service REST API.
 * Falls back to a warning if EMAIL_SERVICE_URL is not configured.
 */
export async function sendEmail(params) {
    if (!EMAIL_SERVICE_URL) {
        if (process.env.NODE_ENV === "development") {
            logger.warn(`EMAIL_SERVICE_URL not configured — skipping email: ${params.eventType}`);
            return { success: false };
        }
        throw new Error("EMAIL_SERVICE_URL must be set in environment variables");
    }
    const res = await axios.post(`${EMAIL_SERVICE_URL}/send`, params, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
    });
    const result = {
        success: res.data?.success ?? false,
        sent: res.data?.result?.sent,
        errors: res.data?.result?.errors,
    };
    if (result.success) {
        logger.info(`Email sent successfully: ${params.eventType} (sent: ${result.sent})`);
    }
    else {
        logger.warn(`Email service returned failure: ${params.eventType}`);
    }
    return result;
}
//# sourceMappingURL=emailClient.js.map
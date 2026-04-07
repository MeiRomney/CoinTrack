import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "../config.js";
import { getLogger } from "./logger.js";
const logger = getLogger();
// Initialize S3 client
const s3Client = new S3Client({
    region: config.aws.region,
    endpoint: config.aws.endpointUrl,
    credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
    },
    forcePathStyle: true, // Required for Railway S3-compatible storage
});
/**
 * Generate a presigned URL for uploading a file to S3
 * @param key - The S3 object key (file path)
 * @param contentType - The MIME type of the file
 * @param expiresIn - URL expiration time in seconds (default: 5 minutes)
 * @returns Presigned upload URL
 */
export async function generatePresignedUploadUrl(key, contentType, expiresIn = 300) {
    try {
        const command = new PutObjectCommand({
            Bucket: config.aws.bucketName,
            Key: key,
            ContentType: contentType,
            ACL: "public-read", // Make uploaded files publicly accessible
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn });
        logger.info(`Generated presigned upload URL for key: ${key}`);
        return url;
    }
    catch (error) {
        logger.error("Error generating presigned upload URL:", {
            error: String(error),
        });
        throw new Error("Failed to generate upload URL");
    }
}
/**
 * Generate a presigned URL for downloading a file from S3
 * @param key - The S3 object key (file path)
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Presigned download URL
 */
export async function generatePresignedDownloadUrl(key, expiresIn = 3600) {
    try {
        const command = new GetObjectCommand({
            Bucket: config.aws.bucketName,
            Key: key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn });
        logger.info(`Generated presigned download URL for key: ${key}`);
        return url;
    }
    catch (error) {
        logger.error("Error generating presigned download URL:", {
            error: String(error),
        });
        throw new Error("Failed to generate download URL");
    }
}
/**
 * Generate a public URL for a file in S3
 * Note: This only works if the file was uploaded with public-read ACL
 * @param key - The S3 object key (file path)
 * @returns Public URL
 */
export function generatePublicUrl(key) {
    const endpoint = config.aws.endpointUrl;
    const bucket = config.aws.bucketName;
    // For Railway S3-compatible storage with path-style URLs
    return `${endpoint}/${bucket}/${key}`;
}
/**
 * Delete a file from S3
 * @param key - The S3 object key (file path)
 */
export async function deleteFile(key) {
    try {
        const command = new DeleteObjectCommand({
            Bucket: config.aws.bucketName,
            Key: key,
        });
        await s3Client.send(command);
        logger.info(`Deleted file from S3: ${key}`);
    }
    catch (error) {
        logger.error("Error deleting file from S3:", { error: String(error) });
        throw new Error("Failed to delete file");
    }
}
/**
 * Check if a file exists in S3
 * @param key - The S3 object key (file path)
 * @returns True if file exists, false otherwise
 */
export async function fileExists(key) {
    try {
        const command = new GetObjectCommand({
            Bucket: config.aws.bucketName,
            Key: key,
        });
        await s3Client.send(command);
        return true;
    }
    catch (error) {
        if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
            return false;
        }
        logger.error("Error checking file existence:", error);
        throw error;
    }
}
/**
 * Generate a unique S3 key for a file
 * @param userId - User ID
 * @param filename - Original filename
 * @param prefix - Optional prefix (e.g., 'profile-images', 'documents')
 * @returns Unique S3 key
 */
export function generateS3Key(userId, filename, prefix = "uploads") {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    return `${prefix}/${userId}/${timestamp}-${sanitizedFilename}`;
}
export { s3Client };
//# sourceMappingURL=s3.js.map
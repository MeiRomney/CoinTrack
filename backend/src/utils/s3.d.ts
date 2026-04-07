import { S3Client } from "@aws-sdk/client-s3";
declare const s3Client: S3Client;
/**
 * Generate a presigned URL for uploading a file to S3
 * @param key - The S3 object key (file path)
 * @param contentType - The MIME type of the file
 * @param expiresIn - URL expiration time in seconds (default: 5 minutes)
 * @returns Presigned upload URL
 */
export declare function generatePresignedUploadUrl(key: string, contentType: string, expiresIn?: number): Promise<string>;
/**
 * Generate a presigned URL for downloading a file from S3
 * @param key - The S3 object key (file path)
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Presigned download URL
 */
export declare function generatePresignedDownloadUrl(key: string, expiresIn?: number): Promise<string>;
/**
 * Generate a public URL for a file in S3
 * Note: This only works if the file was uploaded with public-read ACL
 * @param key - The S3 object key (file path)
 * @returns Public URL
 */
export declare function generatePublicUrl(key: string): string;
/**
 * Delete a file from S3
 * @param key - The S3 object key (file path)
 */
export declare function deleteFile(key: string): Promise<void>;
/**
 * Check if a file exists in S3
 * @param key - The S3 object key (file path)
 * @returns True if file exists, false otherwise
 */
export declare function fileExists(key: string): Promise<boolean>;
/**
 * Generate a unique S3 key for a file
 * @param userId - User ID
 * @param filename - Original filename
 * @param prefix - Optional prefix (e.g., 'profile-images', 'documents')
 * @returns Unique S3 key
 */
export declare function generateS3Key(userId: string, filename: string, prefix?: string): string;
export { s3Client };
//# sourceMappingURL=s3.d.ts.map
import config from "config";

import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { FileData, FileStorage } from "../types/storage";
import createHttpError from "http-errors";

export class S3Storage implements FileStorage {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: config.get("s3.region"),
            credentials: {
                accessKeyId: config.get("s3.accessKeyId"),
                secretAccessKey: config.get("s3.secretAccessKey"),
            },
        });
    }

    async upload(data: FileData): Promise<void> {
        const objectParams = {
            Bucket: config.get("s3.bucket") as string,
            Key: data.filename,
            Body: data.fileData,
        };
        await this.client.send(new PutObjectCommand(objectParams));
    }

    async delete(filename: string): Promise<void> {
        const objectParams = {
            Bucket: config.get("s3.bucket") as string,
            Key: filename,
        };
        await this.client.send(new DeleteObjectCommand(objectParams));
    }
    getObjectUri(filename: string): string {
        // https://mernspace-backend-project.s3.us-east-1.amazonaws.com/292ce08d-0a87-4104-8f31-5f9ae5e8cc44

        const bucket = config.get("s3.bucket");
        const region = config.get("s3.region");

        if (typeof bucket === "string" && typeof region === "string") {
            return `https://${config.get("s3.bucket")}.s3.${config.get("s3.region")}.amazonaws.com/${filename}`;
        }

        const error = createHttpError(500, "Invalid S3 Configuration");
        throw error;
    }
}

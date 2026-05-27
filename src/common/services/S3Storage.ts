/* eslint-disable @typescript-eslint/no-unused-vars */

import config from "config";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { FileData, FileStorage } from "../types/storage";

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
    delete(filename: string): void {
        throw new Error("Method not implemented.");
    }
    getObjectUri(filename: string): string {
        throw new Error("Method not implemented.");
    }
}

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
    region,
  });

export async function getPresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
  }


export async function uploadFile(folder: string, fileName: string, mimetype: string, fileBuffer: Buffer) {
    const key = folder ? `${folder}/${fileName}` : fileName;
    const uploadParams = {
        Body: fileBuffer,
        Bucket: bucketName,
        ContentType: mimetype,
        Key: key,
    };

    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    const uploadedFileUrl =
        `https://${bucketName}.s3.${region}.amazonaws.com/${key}`.replaceAll(
            " ",
            "+",
        );

    return { ...response, Location: uploadedFileUrl,key };
}
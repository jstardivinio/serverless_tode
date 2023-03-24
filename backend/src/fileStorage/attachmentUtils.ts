import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

// TODO: Implement the fileStogare logic
//Generate the Upload URL in S3
export async function generateUploadUrl(todoId: string) {
  
    return s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: todoId,
        Expires: this.urlExpiration
      })
      
    }
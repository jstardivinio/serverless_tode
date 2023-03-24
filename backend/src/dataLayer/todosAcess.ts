import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const todoTableName = process.env.TODOS_TABLE,


const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic


export async function setAttachmentUrl(todoId: string, userId: string, attachmentUrl: string) {
    await this.docClient.update({
      TableName: todoTableName,
      Key: {
        "userId": userId,
        "todoId": todoId
      },
      UpdateExpression: "set attachmentUrl=:attachmentUrl",
      ExpressionAttributeValues:{
          ":attachmentUrl": attachmentUrl
      }
    }).promise()
  }
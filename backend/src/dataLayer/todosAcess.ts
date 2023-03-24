import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


const XAWS = AWSXRay.captureAWS(AWS)
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const todoTableName = process.env.TODOS_TABLE
const todoIndexName = process.env.TODOS_TODO_ID_INDEX


const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

//get todo list from DB
export async function getTodosByUser(userId: string): Promise<TodoItem[]> {

    const result = await docClient.query({
      TableName: todoTableName,
      IndexName: todoIndexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const todos = result.Items

    return todos as TodoItem[]
  }

  //Add a todo in DB
  export async function createTodo(todo: TodoItem) {

    await this.docClient.put({
      TableName: this.todoTableName,
      Item: todo,
    }).promise()
  }

  //Update the fields of a todo
  export async function updateTodo(todoId: string, userId: string, updateTodoRequest: UpdateTodoRequest): Promise<void> {
    await this.docClient.update({
      TableName: this.todoTable,
      Key: {
        "userId": userId,
        "todoId": todoId
      },
      UpdateExpression: "set #name=:name, dueDate=:dueDate, done=:done",
      ExpressionAttributeValues:{
          ":name": updateTodoRequest.name,
          ":dueDate": updateTodoRequest.dueDate,
          ":done": updateTodoRequest.done
      }
    }).promise()
  }

  export async function deleteTodo(todoId: string, userId) {
    logger.info(`Deleting todo item ${todoId} from ${this.todosTable}`)

    await this.docClient.delete({
        TableName: this.todoTable,
        Key: {
          "userId": userId,
          "todoId": todoId
        }
      }).promise()
  } 



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
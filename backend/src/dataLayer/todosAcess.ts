import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
const todoTableName = process.env.TODOS_TABLE
//const todoIndexName = process.env.TODOS_TODO_ID_INDEX


const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

//get todo list from DB
export async function getTodosByUser(userId: string): Promise<TodoItem[]> {

    const result = await docClient.query({
      TableName: todoTableName,
      //IndexName: todoIndexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    const todos = result.Items

    return todos as TodoItem[]
  }

  //Add a todo in DB
  export async function createTodo(todo: TodoItem) {

    await docClient.put({
      TableName: todoTableName,
      Item: todo,
    }).promise()
  }

  //Update the fields of a todo
  export async function updateTodo(todoId: string, userId: string, updateTodoRequest: UpdateTodoRequest): Promise<void> {
    await docClient.update({
      TableName: todoTableName,
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
    logger.info(`Deleting todo item ${todoId} from ${todoTableName}`)

    await docClient.delete({
        TableName: todoTableName,
        Key: {
          "userId": userId,
          "todoId": todoId
        }
      }).promise()
  } 



export async function setAttachmentUrl(todoId: string, userId: string, attachmentUrl: string) {
    await docClient.update({
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
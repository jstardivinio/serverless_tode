import { setAttachmentUrl, getTodosByUser, createTodo as createATodo, updateTodo as updateATodo, deleteTodo as deleteATodo  } from '../dataLayer/todosAcess'
import { generateUploadUrl } from '../fileStorage/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('todos')

//Retrieve a list of todos for a user
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info(`Retrieving all todos for the user with ID ${userId}`)

  return await getTodosByUser(userId)
}

//Create a new todo
export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    
    const todo: TodoItem = {
      userId: userId,
      todoId: uuid.v4(),
      createdAt: new Date().toISOString(),
      done: false,
      attachmentUrl: null,
      ...createTodoRequest
    }
    
    await createATodo(todo)

    logger.info(`New todo Created`)
  
    return todo
  }

  //Update a todo
  export async function updateTodo(todoId: string, userId: string,  updateTodoRequest: UpdateTodoRequest) {
    logger.info(`Updating the todo with ID ${todoId}`)
  
    updateATodo(todoId, userId, updateTodoRequest)

    logger.info(`Successfully updated TODO`)
  }


  //Delete a Todo
  export async function deleteTodo(todoId: string, userId: string) {
    logger.info('Deleting a todo')

    deleteATodo(todoId, userId)
  }

  //Create an upload URL for a TOdo attachment
  export async function createAttachmentPresignedUrl(todoId: string, userId: string) {
    logger.info('Creating an upload URL for this TOdo')
    
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

    const uploadUrl = generateUploadUrl(todoId)

    logger.info('TODO Upload Url Created')


    await setAttachmentUrl(todoId, userId,  attachmentUrl)//
    logger.info('ToDO attachment URL updated')

    return uploadUrl
  }



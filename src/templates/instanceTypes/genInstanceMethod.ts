import { Logger, FUNCTIONS_PATH } from '@/lib'
import { genAuthMethod } from './genAuthMethod'
import { genFirestoreMethod } from './genFirestoreMethod'
import { genHttpMethod } from './genHttpMethod'
import { genHttpMethodParams } from './genHttpMethodParams'
import { genPubSubMethod } from './genPubSubMethod'
import { genScheduleMethod } from './genScheduleMethod'
import { genPubSubMethodParams } from './genPubSubMethodParams'
import { readFileSync, writeFileSync } from 'fs'

export const genInstanceMethod = async (
  instanceType: string,
  functionsName: string,
  methodName: string
) => {
  try {
    switch (instanceType) {
      case 'auth':
        addImportToIndex(instanceType, functionsName, methodName)
        return await genAuthMethod(functionsName, methodName)
      case 'firestore':
        addImportToIndex(instanceType, functionsName, methodName)
        return await genFirestoreMethod(functionsName, methodName)
      case 'pubsub':
        addImportToIndex(instanceType, functionsName, methodName)
        const pubsubParams = await genPubSubMethodParams(
          functionsName,
          methodName
        )
        writeFileSync(pubsubParams.filePath, pubsubParams.body)
        Logger.successCheck(`${pubsubParams.filePath} created`)
        return await genPubSubMethod(functionsName, methodName)
      case 'schedule':
        addImportToIndex(instanceType, functionsName, methodName)
        return await genScheduleMethod(functionsName, methodName)
      default:
        addImportToIndex(instanceType, functionsName, methodName)
        const params = await genHttpMethodParams(functionsName, methodName)
        writeFileSync(params.filePath, params.body)
        Logger.successCheck(`${params.filePath} created`)
        return await genHttpMethod(functionsName, methodName)
    }
  } catch (error) {
    throw new Error(`genInstanceMethod: ${error}`)
  }
}

export const appendLineToFile = (filePath: string, line: string) => {
  try {
    const fileContent = readFileSync(filePath, 'utf8')
    const updatedContent = fileContent.endsWith('\n')
      ? fileContent + line
      : fileContent + '\n' + line
    writeFileSync(filePath, updatedContent)
  } catch (error) {
    throw new Error(`appendLineToFile: ${error}`)
  }
}

const addImportToIndex = (
  instanceType: string,
  functionsName: string,
  methodName: string
) => {
  try {
    const indexFilePath = `${FUNCTIONS_PATH}/${functionsName}/src/routings/${instanceType}/index.ts`
    const bodyLine = `export * from './${methodName}'`
    appendLineToFile(indexFilePath, bodyLine)
  } catch (error) {
    throw new Error(`addImportToIndex: ${error}`)
  }
}

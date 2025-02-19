import * as fs from 'fs'
import * as path from 'path'
import { getFunctions } from './getDirs'

export const getHttpRoutings = async () => {
  const functions = getFunctions()
  const data = []
  for (const functionName of functions) {
    const httpRoutingPath = path.join(
      '.',
      'functions',
      functionName,
      'src',
      'routings',
      'http'
    )
    const files = fs
      .readdirSync(httpRoutingPath)
      .filter((fileName) => fileName.endsWith('.ts') && fileName !== 'index.ts')
      .map((fileName) => fileName.replace(/\.ts$/, ''))
    data.push({ functionName, httpEndpoints: files })
  }
  return data
}

import { Logger } from '@/lib'
import { existsSync } from 'fs'

export const skeetCloudConfigAppGen = async (app = '') => {
  const appName = app === '' ? process.cwd().split('/')[0] : app
  const filePath = './skeet-cloud.config.json'
  if (existsSync(filePath)) {
    Logger.error(`File skeet-cloud.config.json already exists.`)
    process.exit(0)
  }
  const body = `{
  "app": {
    "name": "${appName}",
    "projectId": "${appName}",
    "region": "europe-west4",
    "appDomain": "your-app-url.com",
    "lbDomain": "loadbalancer.your-app-url.com"
  },
  "functions": [],
  "cloudArmor": []
}  
`
  return {
    filePath,
    body,
  }
}

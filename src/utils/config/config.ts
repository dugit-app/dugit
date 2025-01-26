import { homedir } from 'node:os'
import { join } from 'node:path'

export const appName = 'dugit2'
export const clientID = 'Iv23lijtn2t2viXRUXCe'
export const version = '1.0.0'

export const configDirectoryPath = join(homedir(), '.config/', appName)
export const configFilePath = join(configDirectoryPath, 'config.json')

export default {
    appName,
    clientID,
    version,
    configDirectoryPath,
    configFilePath
}

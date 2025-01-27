import { homedir } from 'node:os'
import { join } from 'node:path'

export const appName = 'dugit'
export const clientID = 'Iv23lijtn2t2viXRUXCe'
export const appID = 960869
export const appInstallationLink = 'https://github.com/apps/dugit-app/installations/select_target'
export const repoLink = 'https://github.com/dugit-app/dugit'
export const version = '1.0.2'

export const configDirectoryPath = join(homedir(), '.config/', appName)
export const configFilePath = join(configDirectoryPath, 'config.json')

export default {
    appName,
    clientID,
    appID,
    version,
    configDirectoryPath,
    configFilePath
}

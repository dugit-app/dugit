import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { configDirectoryPath, configFilePath } from './config.js'
import { existsSync } from 'node:fs'

type ConfigFile = {
    accessToken?: string
}

export async function readConfigFile() {
    if (existsSync(configFilePath)) {
        return JSON.parse(await readFile(configFilePath, 'utf8'))
    } else {
        await createConfigFile()
        return {}
    }
}

export async function writeConfigFile(data: ConfigFile) {
    await writeFile(configFilePath, JSON.stringify(data), 'utf8')
}

export async function createConfigFile() {
    await mkdir(configDirectoryPath, { recursive: true })
    await writeConfigFile({})
}

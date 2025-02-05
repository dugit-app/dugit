import { configDirectoryPath, configFilePath } from '@/utils/config/config.js'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

export type ConfigFile = {
    accessToken?: string,
    hiddenClassrooms?: number[],
}

export function jsonToString(data: unknown) {
    return JSON.stringify(data, null, 2)
}

export async function writeJsonFile(path: string, data: unknown) {
    await writeFile(path, jsonToString(data), 'utf8')
}

export async function readJsonFile(path: string) {
    return JSON.parse(await readFile(path, 'utf8'))
}

export async function readConfigFile(): Promise<ConfigFile> {
    if (existsSync(configFilePath)) {
        return readJsonFile(configFilePath)
    }

    await createConfigFile()
    return await readConfigFile()
}

export async function writeConfigFile(data: ConfigFile) {
    await writeJsonFile(configFilePath, data)
}

export async function createConfigFile() {
    await mkdir(configDirectoryPath, { recursive: true })
    await writeConfigFile({ accessToken: '' })
}

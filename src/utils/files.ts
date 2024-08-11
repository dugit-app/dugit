import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

import { configDirectoryPath, configFilePath } from './config.js'

export type ConfigFile = {
    accessToken?: string,
    classrooms: {
        assignments: {
            grades: {
                availablePoints: number,
                instructions: string,
                name: string,
                repositories: {
                    anonymous: string[],
                    instructor: string,
                    teachingAssistant: string,
                }
            }[],
            id: number,
            title: string,
        }[],
        id: number,
        name: string,
        teachingAssistants: {
            email: string
            name: string,
            username: string,
        }[]
    }[]
}

export async function readConfigFile(): Promise<ConfigFile> {
    if (existsSync(configFilePath)) {
        return JSON.parse(await readFile(configFilePath, 'utf8'))
    }

    await createConfigFile()
    return { accessToken: '', classrooms: [] }

}

export async function writeConfigFile(data: ConfigFile) {
    await writeFile(configFilePath, JSON.stringify(data, null, 2), 'utf8')
}

export async function createConfigFile() {
    await mkdir(configDirectoryPath, { recursive: true })
    await writeConfigFile({ accessToken: '', classrooms: [] })
}

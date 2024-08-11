import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

import { configDirectoryPath, configFilePath } from './config.js'

export type Grade = {
    availablePoints: number,
    instructions: string,
    name: string,
    repositories: {
        anonymous: {
            anonymousName: string,
            repositoryName: string,
            studentName: string,
        }[],
        instructor: string,
        teachingAssistant: string,
    }
}

export type ConfigFile = {
    accessToken?: string,
    classrooms: {
        assignments: {
            grades: Grade[],
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

export async function writeJsonFile(path: string, data: unknown) {
    await writeFile(path, JSON.stringify(data, null, 2), 'utf8')
}

export async function readConfigFile(): Promise<ConfigFile> {
    if (existsSync(configFilePath)) {
        return JSON.parse(await readFile(configFilePath, 'utf8'))
    }

    await createConfigFile()
    return { accessToken: '', classrooms: [] }

}

export async function writeConfigFile(data: ConfigFile) {
    await writeJsonFile(configFilePath, data)
}

export async function createConfigFile() {
    await mkdir(configDirectoryPath, { recursive: true })
    await writeConfigFile({ accessToken: '', classrooms: [] })
}

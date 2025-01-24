import { Classrooms } from '@/api/classroom.js'
import { readConfigFile, writeConfigFile } from '@/utils/files.js'

export async function createNewTeachingAssistant(classroom: Classrooms[number], name: string, username: string, email: string) {
    const teachingAssistant = { email, name, username }

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)

    if (configClassroom === undefined) {
        configFile.classrooms.push({
            assignments: [],
            id: classroom.id,
            name: classroom.name,
            teachingAssistants: [teachingAssistant],
        })

        await writeConfigFile(configFile)
        return
    }

    const configTeachingAssistant = configClassroom.teachingAssistants.find(t => {
        const nameMatches = t.name === name
        const usernameMatches = t.username === username
        const emailMatches = t.email === email

        if (nameMatches) {
            console.log('A teaching assistant with that name already exists')
        }

        if (usernameMatches) {
            console.log('A teaching assistant with that username already exists')
        }

        if (emailMatches) {
            console.log('A teaching assistant with that email already exists')
        }

        return nameMatches || usernameMatches || emailMatches
    })

    if (configTeachingAssistant === undefined) {
        configClassroom.teachingAssistants = [teachingAssistant]
    }

    await writeConfigFile(configFile)
}

export async function getTeachingAssistants(classroom: Classrooms[number]) {
    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)

    if (configClassroom === undefined) {
        return []
    }

    return configClassroom.teachingAssistants
}

export async function getTeachingAssistant(classroom: Classrooms[number], username: string) {
    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)
    return configClassroom?.teachingAssistants.find(t => t.username === username)
}

export async function setTeachingAssistantName(classroom: Classrooms[number], username: string, name: string) {
    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)
    const configTeachingAssistant = configClassroom?.teachingAssistants.find(t => t.username === username)

    if (configTeachingAssistant !== undefined) {
        configTeachingAssistant.name = name

        await writeConfigFile(configFile)
    }
}

export async function setTeachingAssistantUsername(classroom: Classrooms[number], username: string, newUsername: string) {
    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)
    const configTeachingAssistant = configClassroom?.teachingAssistants.find(t => t.username === username)

    if (configTeachingAssistant !== undefined) {
        configTeachingAssistant.username = newUsername

        await writeConfigFile(configFile)
    }
}

export async function setTeachingAssistantEmail(classroom: Classrooms[number], username: string, email: string) {
    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)
    const configTeachingAssistant = configClassroom?.teachingAssistants.find(t => t.username === username)

    if (configTeachingAssistant !== undefined) {
        configTeachingAssistant.email = email

        await writeConfigFile(configFile)
    }
}

export async function deleteTeachingAssistant(classroom: Classrooms[number], username: string) {
    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)

    if (configClassroom === undefined) {
        return
    }

    const teachingAssistantIndex = configClassroom.teachingAssistants.findIndex(t => t.username === username)

    if (teachingAssistantIndex > -1) {
        configClassroom.teachingAssistants.splice(teachingAssistantIndex, 1)

        await writeConfigFile(configFile)
    }
}

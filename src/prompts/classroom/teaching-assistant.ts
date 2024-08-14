import { Separator, confirm, input, select } from '@inquirer/prompts'
import { exit } from '@oclif/core/errors'

import { Classrooms } from '../../api/classroom.js'
import {
    createNewTeachingAssistant, deleteTeachingAssistant,
    getTeachingAssistant,
    getTeachingAssistants, setTeachingAssistantEmail, setTeachingAssistantName, setTeachingAssistantUsername,
} from '../../utils/classroom/teaching-assistant.js'
import { classroomOptions } from './classroom.js'

export async function teachingAssistantsOptions(classroom: Classrooms[number]) {
    const option = await select({
        choices: [
            { name: 'New teaching assistant', value: 'new' },
            { name: 'View teaching assistants', value: 'teaching_assistants' },
            new Separator(),
            { name: 'Back', value: 'back' },
        ],
        message: `Teaching assistant options for classroom '${classroom.name}'`,
    }, { clearPromptOnDone: true })

    switch (option) {
        case 'new': {
            await newTeachingAssistant(classroom)
            break
        }

        case 'teaching_assistants': {
            await selectTeachingAssistant(classroom)
            break
        }

        case 'back': {
            await classroomOptions(classroom)
            break
        }
    }
}

export async function newTeachingAssistant(classroom: Classrooms[number]) {
    const name = await input({ message: 'Enter the teaching assistant\'s name' }, { clearPromptOnDone: true })
    const username = await input({ message: 'Enter the teaching assistant\'s GitHub username' }, { clearPromptOnDone: true })
    const email = await input({ message: 'Enter the teaching assistant\'s email' }, { clearPromptOnDone: true })

    await createNewTeachingAssistant(classroom, name, username, email)
}

export async function selectTeachingAssistant(classroom: Classrooms[number]) {
    await teachingAssistantOptions(classroom, (await select({
        choices: (await getTeachingAssistants(classroom)).map(teachingAssistant => ({
            name: teachingAssistant.name,
            value: teachingAssistant.username,
        })),
        message: 'Select a teaching assistant',
    }, { clearPromptOnDone: true })))
}

export async function teachingAssistantOptions(classroom: Classrooms[number], username: string) {
    const teachingAssistant = await getTeachingAssistant(classroom, username)

    if (teachingAssistant === undefined) {
        return
    }

    const option = await select({
        choices: [
            { name: `Edit name (${teachingAssistant.name})`, value: 'name' },
            { name: `Edit username (${teachingAssistant.username})`, value: 'username' },
            { name: `Edit email (${teachingAssistant.email})`, value: 'email' },
            { name: 'Remove teaching assistant', value: 'remove' },
            new Separator(),
            { name: 'Back', value: 'back' },
        ],
        message: `Options for teaching assistant ${teachingAssistant.name}`,
    }, { clearPromptOnDone: true })

    switch (option) {
        case 'name': {
            await editTeachingAssistantName(classroom, username)
            break
        }

        case 'username': {
            await editTeachingAssistantUsername(classroom, username)
            break
        }

        case 'email': {
            await editTeachingAssistantEmail(classroom, username)
            break
        }

        case 'remove': {
            await removeTeachingAssistant(classroom, username)
            break
        }

        case 'back': {
            await teachingAssistantsOptions(classroom)
            break
        }
    }
}

export async function editTeachingAssistantName(classroom: Classrooms[number], username: string) {
    const name = await input({ message: 'Enter the new name' }, { clearPromptOnDone: true })
    await setTeachingAssistantName(classroom, username, name)
}

export async function editTeachingAssistantUsername(classroom: Classrooms[number], username: string) {
    const newUsername = await input({ message: 'Enter the new username' }, { clearPromptOnDone: true })
    await setTeachingAssistantUsername(classroom, username, newUsername)
}

export async function editTeachingAssistantEmail(classroom: Classrooms[number], username: string) {
    const email = await input({ message: 'Enter the new username' }, { clearPromptOnDone: true })
    await setTeachingAssistantEmail(classroom, username, email)
}

export async function removeTeachingAssistant(classroom: Classrooms[number], username: string) {
    const doDelete = await confirm({
        default: false,
        message: `Are you sure you want to delete ${(await getTeachingAssistant(classroom, username))?.name}?`,
    }, { clearPromptOnDone: true })

    if (doDelete) {
        await deleteTeachingAssistant(classroom, username)
    } else {
        console.log('Cancelled')
        exit(0)
    }
}

import { Separator, select } from '@inquirer/prompts'
import { exit } from '@oclif/core/errors'
import open from 'open'

import { Classrooms, getClassrooms } from '../../api/classroom.js'
import { selectAssignment } from './assignment.js'
import { teachingAssistantsOptions } from './teaching-assistant.js'

export async function selectClassroom() {
    const classrooms = await getClassrooms()

    const classroom = await select({
        choices: classrooms.map(classroom => ({ name: classroom.name, value: classroom })),
        message: 'Select a classroom',
    }, { clearPromptOnDone: true })

    await classroomOptions(classroom)
}

export async function classroomOptions(classroom: Classrooms[number]) {
    const option = await select({
        choices: [
            { name: 'View assignments', value: 'assignments' },
            { name: 'Teaching assistants', value: 'teaching_assistants' },
            { name: 'Info', value: 'info' },
            { name: 'Open in browser', value: 'open' },
            new Separator(),
            { name: 'Back', value: 'back' },
        ],
        message: `Options for classroom '${classroom.name}'`,
    }, { clearPromptOnDone: true })

    switch (option) {
        case 'assignments': {
            await selectAssignment(classroom)
            break
        }

        case 'teaching_assistants': {
            await teachingAssistantsOptions(classroom)
            break
        }

        case 'info': {
            console.log(classroom)
            break
        }

        case 'open': {
            await open(classroom.url)
            break
        }

        case 'back': {
            exit(0)
        }
    }
}

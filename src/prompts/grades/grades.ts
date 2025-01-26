import { Separator } from '@inquirer/prompts'

import api from '@/api/api.js'
import add from '@/prompts/grades/add/add.js'
import remove from '@/prompts/grades/remove/remove.js'
import { select } from '@/utils/prompts/prompts.js'
import view from '@/prompts/grades/view/view.js'
import { getOrganizationAppInstallations } from '@/api/org.js'
import { appID, appInstallationLink } from '@/utils/config/config.js'
import chalk from 'chalk'
import { isAppInstalled } from '@/prompts/classroom/classroom.js'

export default async function grades() {
    const option = await select(
        {
            message: 'Select an option',
            choices: [
                { name: 'Add grade', value: 'add' },
                { name: 'View grade', value: 'view' },
                { name: 'Remove grade', value: 'remove' },
                new Separator(),
                { name: 'Back', value: 'back' },
            ],
        },
    )

    if (option == 'back') {
        return
    }

    const classroomSelect = await select(
        {
            message: 'Select a classroom',
            choices: (await api.getClassrooms()).map((classroom) => ({
                name: classroom.name,
                value: classroom,
            })),
            noOptionsMessage: 'No classrooms exist',
        },
    )

    if (!classroomSelect) {
        return
    }

    const classroom = await api.getClassroom(classroomSelect.id)

    if (!await isAppInstalled(classroom)) {
        return
    }

    const assignment = await select(
        {
            message: 'Select an assignment',
            choices: (await api.getAssignments(classroom.id)).map((assignment) => ({
                name: assignment.title,
                value: assignment,
            })),
            noOptionsMessage: `No assignments exist for ${classroom.name}`,
        },
    )

    if (!assignment) {
        return
    }

    switch (option) {
        case 'add': {
            await add(assignment, classroom)
            break
        }
        case 'view': {
            await view(assignment, classroom)
            break
        }

        case 'remove': {
            await remove(assignment, classroom)
            break
        }
    }

    await grades()
}

import { Separator, select } from '@inquirer/prompts'

import prompts from '@/prompts/prompts.js'
import api from '@/api/api.js'
import utils from '@/utils/utils.js'
import add from '@/prompts/grades/add/add.js'
import remove from '@/prompts/grades/remove/remove.js'

export default async function grades() {
    const option = await select(
        {
            choices: [
                { name: 'Add grade', value: 'add' },
                { name: 'Remove grade', value: 'remove' },
                new Separator(),
                { name: 'Back', value: 'back' },
            ],
            message: 'Select an option',
        },
        { clearPromptOnDone: true },
    )

    if (option == 'back') {
        await prompts.prompts()
        return
    }

    const classroomSelect = await select(
        {
            choices: (await api.getClassrooms()).map((classroom) => ({
                name: classroom.name,
                value: classroom,
            })),
            message: 'Select an organization',
        },
        { clearPromptOnDone: true },
    )

    const classroom = await api.getClassroom(classroomSelect.id)

    const assignment = await select(
        {
            choices: (await api.getAssignments(classroom.id)).map((assignment) => ({
                name: assignment.title,
                value: assignment,
            })),
            message: '',
        },
        { clearPromptOnDone: true },
    )

    switch (option) {
        case 'add': {
            await add(assignment, classroom)
            break
        }

        case 'remove': {
            await remove(assignment, classroom)
            break
        }
    }

    await grades()
}

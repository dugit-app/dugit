import { Separator } from '@inquirer/prompts'

import prompts from '@/prompts/prompts.js'
import api from '@/api/api.js'
import add from '@/prompts/grades/add/add.js'
import remove from '@/prompts/grades/remove/remove.js'
import selectOptions from '@/utils/prompts.js'

export default async function grades() {
    const option = await selectOptions(
        {
            message: 'Select an option',
            choices: [
                { name: 'Add grade', value: 'add' },
                { name: 'Remove grade', value: 'remove' },
                new Separator(),
                { name: 'Back', value: 'back' },
            ],
        },
    )

    if (option == 'back') {
        await prompts.prompts()
        return
    }

    const classroomSelect = await selectOptions(
        {
            message: 'Select a classroom',
            choices: (await api.getClassrooms()).map((classroom) => ({
                name: classroom.name,
                value: classroom,
            })),
            noOptionsMessage: 'No classrooms exist'
        },
    )

    if (!classroomSelect) {
        return
    }

    const classroom = await api.getClassroom(classroomSelect.id)

    const assignment = await selectOptions(
        {
            message: 'Select an assignment',
            choices: (await api.getAssignments(classroom.id)).map((assignment) => ({
                name: assignment.title,
                value: assignment,
            })),
            noOptionsMessage: `No assignments exist for ${classroom.name}`
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

        case 'remove': {
            await remove(assignment, classroom)
            break
        }
    }

    await grades()
}

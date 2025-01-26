import { Separator } from '@inquirer/prompts'

import api from '@/api/api.js'
import add from '@/prompts/tas/add/add.js'
import edit from '@/prompts/tas/edit/edit.js'
import remove from '@/prompts/tas/remove/remove.js'
import { select } from '@/utils/prompts.js'

export default async function tas() {
    const option = await select(
        {
            message: 'Select an option',
            choices: [
                { name: 'Add TA', value: 'add' },
                { name: 'Edit TA', value: 'edit' },
                { name: 'Remove TA', value: 'remove' },
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
            noOptionsMessage: 'No classrooms exist'
        },
    )

    if (!classroomSelect) {
        return
    }

    const classroom = await api.getClassroom(classroomSelect.id)

    switch (option) {
        case 'add': {
            await add(classroom)
            break
        }

        case 'edit': {
            await edit(classroom)
            break
        }

        case 'remove': {
            await remove(classroom)
            break
        }
    }

    await tas()
}

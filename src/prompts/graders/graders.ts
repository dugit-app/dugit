import { Separator } from '@inquirer/prompts'

import api from '@/api/api.js'
import add from '@/prompts/graders/add/add.js'
import edit from '@/prompts/graders/edit/edit.js'
import remove from '@/prompts/graders/remove/remove.js'
import { select } from '@/utils/prompts/prompts.js'
import { isAppInstalled } from '@/prompts/classroom/classroom.js'
import ora from 'ora'

export default async function graders() {
    const option = await select(
        {
            message: 'Select an option',
            choices: [
                { name: 'Add grader', value: 'add' },
                { name: 'Edit grader', value: 'edit' },
                { name: 'Remove grader', value: 'remove' },
                new Separator(),
                { name: 'Back', value: 'back' },
            ],
        },
    )

    if (option == 'back') {
        return
    }

    const spinner = ora().start()
    const classrooms = await api.getClassrooms()
    spinner.stop()

    const classroomSelect = await select(
        {
            message: 'Select a classroom',
            choices: classrooms.map((classroom) => ({
                name: classroom.name,
                value: classroom,
            })),
            noOptionsMessage: 'No classrooms exist'
        },
    )

    if (!classroomSelect) {
        return
    }

    spinner.start()
    const classroom = await api.getClassroom(classroomSelect.id)

    if (!await isAppInstalled(classroom)) {
        spinner.stop()
        return
    }

    spinner.stop()

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

    await graders()
}

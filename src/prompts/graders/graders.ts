import { getClassroom, getClassrooms } from '@/api/classroom/classroom.js'
import { addGraderPrompt } from '@/prompts/graders/add/add.js'
import { editGraderPrompt } from '@/prompts/graders/edit/edit.js'
import { removeGraderPrompt } from '@/prompts/graders/remove/remove.js'
import { isAppInstalled } from '@/utils/classroom/classroom.js'
import { getNonHiddenClassrooms } from '@/utils/classroom/hide/hide.js'
import { select } from '@/utils/prompts/prompts.js'
import ora from 'ora'

export async function graders() {
    const spinner = ora().start()
    const classrooms = await getNonHiddenClassrooms(await getClassrooms())
    spinner.stop()

    const classroomSelect = await select(
        {
            message: 'Select a classroom',
            choices: classrooms.map((classroom) => ({
                name: classroom.name,
                value: classroom,
            })),
            noOptionsMessage: 'No classrooms exist',
        },
    )

    if (!classroomSelect) {
        return
    }

    spinner.start()
    const classroom = await getClassroom(classroomSelect.id)

    if (!await isAppInstalled(classroom, spinner)) {
        return
    }

    spinner.stop()

    const option = await select(
        {
            message: `${classroom.name}`,
            choices: [
                { name: 'Add grader', value: 'add' },
                { name: 'Edit grader', value: 'edit' },
                { name: 'Remove grader', value: 'remove' },
            ],
        },
    )

    if (!option) {
        return
    }

    switch (option) {
        case 'add': {
            await addGraderPrompt(classroom)
            break
        }

        case 'edit': {
            await editGraderPrompt(classroom)
            break
        }

        case 'remove': {
            await removeGraderPrompt(classroom)
            break
        }
    }
}

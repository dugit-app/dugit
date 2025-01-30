import ora from 'ora'

import api from '@/api/api.js'
import add from '@/prompts/grades/add/add.js'
import remove from '@/prompts/grades/remove/remove.js'
import { select } from '@/utils/prompts/prompts.js'
import view from '@/prompts/grades/view/view.js'
import { isAppInstalled } from '@/utils/classroom/classroom.js'

export default async function grades() {
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
            noOptionsMessage: 'No classrooms exist for your account',
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

    const assignments = await api.getAssignments(classroom.id)
    spinner.stop()

    const assignment = await select(
        {
            message: `${classroom.name} > Select an assignment`,
            choices: assignments.map((assignment) => ({
                name: assignment.title,
                value: assignment,
            })),
            noOptionsMessage: `No assignments exist for ${classroom.name}`,
        },
    )

    if (!assignment) {
        return
    }

    const option = await select(
        {
            message: `${classroom.name} > ${assignment.title}`,
            choices: [
                { name: 'Add grade', value: 'add' },
                { name: 'View grade', value: 'view' },
                { name: 'Remove grade', value: 'remove' },
            ],
        },
    )

    if (!option) {
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
}

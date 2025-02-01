import { getAssignments } from '@/api/assignment/assignment.js'
import { getClassroom, getClassrooms } from '@/api/classroom/classroom.js'
import { addGradePrompt } from '@/prompts/grades/add/add.js'
import { removeGradePrompt } from '@/prompts/grades/remove/remove.js'
import { viewGradePrompt } from '@/prompts/grades/view/view.js'
import { isAppInstalled } from '@/utils/classroom/classroom.js'
import { select } from '@/utils/prompts/prompts.js'
import ora from 'ora'

export async function grades() {
    const spinner = ora().start()
    const classrooms = await getClassrooms()
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
    const classroom = await getClassroom(classroomSelect.id)

    if (!await isAppInstalled(classroom)) {
        spinner.stop()
        return
    }

    const assignments = await getAssignments(classroom.id)
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
            await addGradePrompt(assignment, classroom)
            break
        }

        case 'view': {
            await viewGradePrompt(assignment, classroom)
            break
        }

        case 'remove': {
            await removeGradePrompt(assignment, classroom)
            break
        }
    }
}

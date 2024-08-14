import { Separator, select } from '@inquirer/prompts'

import { Assignments, getAssignments } from '../../api/assignment.js'
import { Classrooms } from '../../api/classroom.js'
import { classroomOptions } from './classroom.js'
import { gradesOptions } from './grade.js'


export async function selectAssignment(classroom: Classrooms[number]) {
    const assignments = await getAssignments(classroom.id)

    const assignment = await select({
        choices: assignments.map(assignment => ({ name: assignment.title, value: assignment })),
        message: 'Select an assignment',
    }, { clearPromptOnDone: true })

    await assignmentOptions(assignment)
}

export async function assignmentOptions(assignment: Assignments[number]) {
    const option = await select({
        choices: [
            { name: 'Grades', value: 'grades' },
            { name: 'Info', value: 'info' },
            new Separator(),
            { name: 'Back', value: 'back' },
        ],
        message: `Options for assignment '${assignment.title}'`,
    }, { clearPromptOnDone: true })

    switch (option) {
        case 'grades': {
            await gradesOptions(assignment)
            break
        }

        case 'info': {
            console.log(assignment)
            break
        }

        case 'back': {
            await classroomOptions(assignment.classroom)
            break
        }
    }
}

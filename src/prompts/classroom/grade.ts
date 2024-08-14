import { Separator, confirm, input, number, select } from '@inquirer/prompts'
import { exit } from '@oclif/core/errors'

import { Assignments } from '../../api/assignment.js'
import { createGradeRepositories, updateGrade } from '../../utils/classroom/classroom.js'
import { deleteGrade, getGrade, getGrades } from '../../utils/classroom/grade.js'
import { assignmentOptions } from './assignment.js'


export async function gradesOptions(assignment: Assignments[number]) {
    const option = await select({
        choices: [
            { description: 'Generate anonymous repositories for grading', name: 'New grade', value: 'new' },
            { name: 'View grades', value: 'grades' },
            new Separator(),
            { name: 'Back', value: 'back' },
        ],
        message: `Grade options for assignment '${assignment.title}'`,
    }, { clearPromptOnDone: true })

    switch (option) {
        case 'new': {
            await newGrade(assignment)
            break
        }

        case 'grades': {
            await selectGrade(assignment)
            break
        }

        case 'back': {
            await assignmentOptions(assignment)
            break
        }
    }
}

export async function selectGrade(assignment: Assignments[number]) {
    await gradeOptions(assignment, (await select({
        choices: (await getGrades(assignment)).map(grade => ({
            name: grade.name,
            value: grade.name,
        })),
        message: `Select a grade for assignment '${assignment.title}'`,
    }, { clearPromptOnDone: true })))
}

export async function newGrade(assignment: Assignments[number]) {
    const gradeName = await input({ message: 'Give the grade a name' }, { clearPromptOnDone: true })
    const gradingInstructions = await input({ message: 'Enter the grading instructions' }, { clearPromptOnDone: true })
    const availablePoints = await number({ message: 'Enter the available points for this grade' }, { clearPromptOnDone: true }) || 0

    await createGradeRepositories(assignment, gradeName, gradingInstructions, availablePoints)
}

export async function gradeOptions(assignment: Assignments[number], name: string) {
    const grade = await getGrade(assignment, name)

    if (grade === undefined) {
        return
    }

    const option = await select({
        choices: [
            { name: 'Update grades on instructor repo', value: 'update' },
            { name: 'Info', value: 'info' },
            { name: 'Delete', value: 'delete' },
            new Separator(),
            { name: 'Back', value: 'back' },
        ],
        message: `Options for grade ${name}`,
    }, { clearPromptOnDone: true })

    switch (option) {
        case 'update': {
            await updateGrade(assignment, name)
            break
        }

        case 'info': {
            console.log(grade)
            break
        }

        case 'delete': {
            await removeGrade(assignment, name)
            break
        }

        case 'back': {
            await gradesOptions(assignment)
            break
        }
    }
}

export async function removeGrade(assignment: Assignments[number], name: string) {
    const doDelete = await confirm({
        default: false,
        message: `Are you sure you want to delete ${name}?`,
    }, { clearPromptOnDone: true })

    if (doDelete) {
        await deleteGrade(assignment, name)
    } else {
        console.log('Cancelled')
        exit(0)
    }
}

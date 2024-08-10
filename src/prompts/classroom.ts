import { Separator, input, select } from '@inquirer/prompts'
import { exit } from '@oclif/core/errors'
import open from 'open'

import {
    createGradeRepositories,
    getAssignment,
    getAssignments,
    getClassroom,
    getClassrooms,
} from '../utils/classroom.js'

export async function selectClassroom() {
    await classroomOptions(await select({
        choices: (await getClassrooms()).map(classroom => ({
            name: classroom.name,
            value: classroom.id,
        })),
        message: 'Select a classroom',
    }, { clearPromptOnDone: true }))
}

async function classroomOptions(classroomID: number) {
    const classroom = await getClassroom(classroomID)

    const option = await select({
        choices: [
            { name: 'View assignments', value: 'assignments' },
            { name: 'Info', value: 'info' },
            { name: 'Open in browser', value: 'open' },
            new Separator(),
            { name: 'Back', value: 'back' },
        ],
        message: `Options for classroom '${classroom.name}'`,
    }, { clearPromptOnDone: true })

    switch (option) {
        case 'assignments': {
            await selectAssignment(classroomID)
            break
        }

        case 'info': {
            console.log(classroom)
            break
        }

        case 'open': {
            await open(classroom.url)
            break
        }

        case 'back': {
            exit(0)
        }
    }
}

async function selectAssignment(classroomID: number) {
    await assignmentOptions(await select({
        choices: (await getAssignments(classroomID)).map(assignment => ({
            name: assignment.title,
            value: assignment.id,
        })),
        message: 'Select an assignment',
    }, { clearPromptOnDone: true }))
}

async function assignmentOptions(assignmentID: number) {
    const assignment = await getAssignment(assignmentID)

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
            await gradesOptions(assignmentID)
            break
        }

        case 'info': {
            console.log(assignment)
            break
        }

        case 'back': {
            await classroomOptions(assignment.classroom.id)
            break
        }
    }
}

async function gradesOptions(assignmentID: number) {
    const assignment = await getAssignment(assignmentID)

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
            await newGrade(assignmentID)
            break
        }

        case 'grades': {
            await selectGrades(assignmentID)
            break
        }

        case 'back': {
            await assignmentOptions(assignmentID)
            break
        }
    }
}

async function selectGrades(assignmentID: number) {
    // return select({
    //     choices: (await getAssignments(assignmentID)).map(assignment => ({
    //         name: assignment.title,
    //         value: assignment,
    //     })),
    //     message: 'Select a grade',
    // }, { clearPromptOnDone: true })
    console.log(assignmentID)
}

async function newGrade(assignmentID: number) {
    const gradeName = await input({ message: 'Give the grade a name' }, { clearPromptOnDone: true })
    await createGradeRepositories(assignmentID, gradeName)
}

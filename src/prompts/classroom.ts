import { Separator, confirm, input, select } from '@inquirer/prompts'
import { exit } from '@oclif/core/errors'
import open from 'open'

import {
    createGradeRepositories,
    createNewTeachingAssistant, deleteTeachingAssistant,
    getAssignment,
    getAssignments,
    getClassroom,
    getClassrooms,
    getTeachingAssistant,
    getTeachingAssistants,
    setTeachingAssistantEmail,
    setTeachingAssistantName,
    setTeachingAssistantUsername,
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
            { name: 'Teaching assistants', value: 'teaching_assistants' },
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

        case 'teaching_assistants': {
            await teachingAssistantsOptions(classroomID)
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

async function teachingAssistantsOptions(classroomID: number) {
    const classroom = await getClassroom(classroomID)

    const option = await select({
        choices: [
            { name: 'New teaching assistant', value: 'new' },
            { name: 'View teaching assistants', value: 'teaching_assistants' },
            new Separator(),
            { name: 'Back', value: 'back' },
        ],
        message: `Teaching assistant options for classroom '${classroom.name}'`,
    }, { clearPromptOnDone: true })

    switch (option) {
        case 'new': {
            await newTeachingAssistant(classroomID)
            break
        }

        case 'teaching_assistants': {
            await selectTeachingAssistant(classroomID)
            break
        }

        case 'back': {
            await classroomOptions(classroom.id)
            break
        }
    }
}

async function newTeachingAssistant(classroomID: number) {
    const name = await input({ message: 'Enter the teaching assistant\'s name' }, { clearPromptOnDone: true })
    const username = await input({ message: 'Enter the teaching assistant\'s GitHub username' }, { clearPromptOnDone: true })
    const email = await input({ message: 'Enter the teaching assistant\'s email' }, { clearPromptOnDone: true })

    await createNewTeachingAssistant(classroomID, name, username, email)
}

async function selectTeachingAssistant(classroomID: number) {
    await teachingAssistantOptions(classroomID, (await select({
        choices: (await getTeachingAssistants(classroomID)).map(teachingAssistant => ({
            name: teachingAssistant.name,
            value: teachingAssistant.username,
        })),
        message: 'Select a teaching assistant',
    }, { clearPromptOnDone: true })))
}

async function teachingAssistantOptions(classroomID: number, username: string) {
    const teachingAssistant = await getTeachingAssistant(classroomID, username)

    if (teachingAssistant === undefined) {
        return
    }

    const option = await select({
        choices: [
            { name: `Edit name (${teachingAssistant.name})`, value: 'name' },
            { name: `Edit username (${teachingAssistant.name})`, value: 'username' },
            { name: `Edit email (${teachingAssistant.name})`, value: 'email' },
            { name: 'Remove teaching assistant', value: 'remove' },
            new Separator(),
            { name: 'Back', value: 'back' },
        ],
        message: `Options for teaching assistant ${teachingAssistant.name}`,
    }, { clearPromptOnDone: true })

    switch (option) {
        case 'name': {
            await editTeachingAssistantName(classroomID, username)
            break
        }

        case 'username': {
            await editTeachingAssistantUsername(classroomID, username)
            break
        }

        case 'email': {
            await editTeachingAssistantEmail(classroomID, username)
            break
        }

        case 'remove': {
            await removeTeachingAssistant(classroomID, username)
            break
        }

        case 'back': {
            await teachingAssistantsOptions(classroomID)
            break
        }
    }
}

async function editTeachingAssistantName(classroomID: number, username: string) {
    const name = await input({ message: 'Enter the new name' }, { clearPromptOnDone: true })
    await setTeachingAssistantName(classroomID, username, name)
}

async function editTeachingAssistantUsername(classroomID: number, username: string) {
    const newUsername = await input({ message: 'Enter the new username' }, { clearPromptOnDone: true })
    await setTeachingAssistantUsername(classroomID, username, newUsername)
}

async function editTeachingAssistantEmail(classroomID: number, username: string) {
    const email = await input({ message: 'Enter the new username' }, { clearPromptOnDone: true })
    await setTeachingAssistantEmail(classroomID, username, email)
}

async function removeTeachingAssistant(classroomID: number, username: string) {
    const doDelete = await confirm({
        default: false,
        message: `Are you sure you want to delete ${(await getTeachingAssistant(classroomID, username))?.name}?`
    }, { clearPromptOnDone: true })

    if (doDelete) {
        await deleteTeachingAssistant(classroomID, username)
    } else {
        console.log('Cancelled')
        exit(0)
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

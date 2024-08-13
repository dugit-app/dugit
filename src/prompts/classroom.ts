import { Separator, confirm, input, number, select } from '@inquirer/prompts'
import { exit } from '@oclif/core/errors'
import open from 'open'

import { getAssignment, getAssignments } from '../api/assignment.js'
import { Classrooms, getClassrooms } from '../api/classroom.js'
import { createGradeRepositories, updateGrade } from '../utils/classroom/classroom.js'
import { deleteGrade, getGrade, getGrades } from '../utils/classroom/grade.js'
import {
    createNewTeachingAssistant, deleteTeachingAssistant,
    getTeachingAssistant,
    getTeachingAssistants, setTeachingAssistantEmail, setTeachingAssistantName, setTeachingAssistantUsername,
} from '../utils/classroom/teaching-assistant.js'

export async function selectClassroom() {
    const classrooms = await getClassrooms()

    const prompt = await select({
        choices: classrooms.map(classroom => ({
            name: classroom.name,
            value: classroom,
        })),
        message: 'Select a classroom',
    }, { clearPromptOnDone: true })

    await classroomOptions(prompt)
}

async function classroomOptions(classroom: Classrooms[number]) {
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
            await selectAssignment(classroom)
            break
        }

        case 'teaching_assistants': {
            await teachingAssistantsOptions(classroom)
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

async function teachingAssistantsOptions(classroom: Classrooms[number]) {
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
            await newTeachingAssistant(classroom.id)
            break
        }

        case 'teaching_assistants': {
            await selectTeachingAssistant(classroom)
            break
        }

        case 'back': {
            await classroomOptions(classroom)
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

async function selectTeachingAssistant(classroom: Classrooms[number]) {
    await teachingAssistantOptions(classroom, (await select({
        choices: (await getTeachingAssistants(classroom)).map(teachingAssistant => ({
            name: teachingAssistant.name,
            value: teachingAssistant.username,
        })),
        message: 'Select a teaching assistant',
    }, { clearPromptOnDone: true })))
}

async function teachingAssistantOptions(classroom: Classrooms[number], username: string) {
    const teachingAssistant = await getTeachingAssistant(classroom.id, username)

    if (teachingAssistant === undefined) {
        return
    }

    const option = await select({
        choices: [
            { name: `Edit name (${teachingAssistant.name})`, value: 'name' },
            { name: `Edit username (${teachingAssistant.username})`, value: 'username' },
            { name: `Edit email (${teachingAssistant.email})`, value: 'email' },
            { name: 'Remove teaching assistant', value: 'remove' },
            new Separator(),
            { name: 'Back', value: 'back' },
        ],
        message: `Options for teaching assistant ${teachingAssistant.name}`,
    }, { clearPromptOnDone: true })

    switch (option) {
        case 'name': {
            await editTeachingAssistantName(classroom.id, username)
            break
        }

        case 'username': {
            await editTeachingAssistantUsername(classroom.id, username)
            break
        }

        case 'email': {
            await editTeachingAssistantEmail(classroom.id, username)
            break
        }

        case 'remove': {
            await removeTeachingAssistant(classroom.id, username)
            break
        }

        case 'back': {
            await teachingAssistantsOptions(classroom)
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
        message: `Are you sure you want to delete ${(await getTeachingAssistant(classroomID, username))?.name}?`,
    }, { clearPromptOnDone: true })

    if (doDelete) {
        await deleteTeachingAssistant(classroomID, username)
    } else {
        console.log('Cancelled')
        exit(0)
    }
}

async function selectAssignment(classroom: Classrooms[number]) {
    await assignmentOptions(await select({
        choices: (await getAssignments(classroom.id)).map(assignment => ({
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
            await classroomOptions(assignment.classroom)
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
            await selectGrade(assignmentID)
            break
        }

        case 'back': {
            await assignmentOptions(assignmentID)
            break
        }
    }
}

async function selectGrade(assignmentID: number) {
    const assignment = await getAssignment(assignmentID)

    await gradeOptions(assignmentID, (await select({
        choices: (await getGrades(assignmentID)).map(grade => ({
            name: grade.name,
            value: grade.name,
        })),
        message: `Select a grade for assignment '${assignment.title}'`,
    }, { clearPromptOnDone: true })))
}

async function newGrade(assignmentID: number) {
    const gradeName = await input({ message: 'Give the grade a name' }, { clearPromptOnDone: true })
    const gradingInstructions = await input({ message: 'Enter the grading instructions' }, { clearPromptOnDone: true })
    const availablePoints = await number({ message: 'Enter the available points for this grade' }, { clearPromptOnDone: true }) || 0

    await createGradeRepositories(assignmentID, gradeName, gradingInstructions, availablePoints)
}

async function gradeOptions(assignmentID: number, name: string) {
    const grade = await getGrade(assignmentID, name)

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
            await updateGrade(assignmentID, name)
            break
        }

        case 'info': {
            console.log(grade)
            break
        }

        case 'delete': {
            await removeGrade(assignmentID, name)
            break
        }

        case 'back': {
            await gradesOptions(assignmentID)
            break
        }
    }
}

async function removeGrade(assignmentID: number, name: string) {
    const doDelete = await confirm({
        default: false,
        message: `Are you sure you want to delete ${name}?`,
    }, { clearPromptOnDone: true })

    if (doDelete) {
        await deleteGrade(assignmentID, name)
    } else {
        console.log('Cancelled')
        exit(0)
    }
}

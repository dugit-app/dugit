import { select } from '@inquirer/prompts'
import { Octokit } from 'octokit'

import { getAccessToken } from './auth.js'
import { headers } from './octokit.js'

export async function listClassrooms() {
    const octokit = new Octokit({ auth: await getAccessToken() })

    const classrooms = (await octokit.request('GET /classrooms', { headers })).data

    const selectedClassroom = await select({
        choices: classrooms.map(classroom => ({
            name: classroom.name,
            value: classroom,
        })),
        message: 'Select a classroom',
    }, { clearPromptOnDone: true })

    await listAssignments(selectedClassroom.id)
}

export async function listAssignments(classroomID: number) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    const assignments = (await octokit.request('GET /classrooms/{classroom_id}/assignments', {
        'classroom_id': classroomID,
        headers,
    })).data

    const selectedAssignment = await select({
        choices: assignments.map(assignment => ({
            name: assignment.title,
            value: assignment,
        })),
        message: 'Select an assignment',
    }, { clearPromptOnDone: true })

    await listAcceptedAssignments(selectedAssignment.id)
}

export async function listAcceptedAssignments(assignmentID: number) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    const assignments = (await octokit.request('GET /assignments/{assignment_id}/accepted_assignments', {
        'assignment_id': assignmentID,
        headers,
    })).data

    console.log(assignments.map(assignment => assignment.students.map(student => student.login)))
}

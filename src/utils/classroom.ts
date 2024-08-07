import { input, select } from '@inquirer/prompts'
import { Octokit } from 'octokit'
import slug from 'slug'

import { getAccessToken } from './auth.js'
import { headers } from './octokit.js'


export async function getClassrooms() {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /classrooms', { headers })).data
}

export async function getClassroom(classroomID: number) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /classrooms/{classroom_id}', {
        'classroom_id': classroomID,
        headers,
    })).data
}

export async function selectClassroom() {
    const selectedClassroom = await select({
        choices: (await getClassrooms()).map(classroom => ({
            name: classroom.name,
            value: classroom.id,
        })),
        message: 'Select a classroom:',
    }, { clearPromptOnDone: true })

    return getClassroom(selectedClassroom)
}

export async function getAssignments(classroomID: number) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /classrooms/{classroom_id}/assignments', {
        'classroom_id': classroomID,
        headers,
    })).data
}

export async function selectAssignment(classroomID: number) {
    return select({
        choices: (await getAssignments(classroomID)).map(assignment => ({
            name: assignment.title,
            value: assignment,
        })),
        message: 'Select an assignment:',
    }, { clearPromptOnDone: true })
}

export async function getAcceptedAssignments(assignmentID: number) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /assignments/{assignment_id}/accepted_assignments', {
        'assignment_id': assignmentID,
        headers,
    })).data
}

export async function createInstructorRepository() {
    const classroom = await selectClassroom()
    const assignment = await selectAssignment(classroom.id)
    const gradeName = await input({message: 'Give the grade a name:'}, { clearPromptOnDone: true })

    const organizationName = classroom.organization.login
    const repositoryName = `${assignment.slug}-${slug(gradeName)}-instructor`

    const octokit = new Octokit({ auth: await getAccessToken() })

    const response = (await octokit.request('POST /orgs/{org}/repos', {
        'has_issues': false,
        'has_projects': false,
        'has_wiki': false,
        headers,
        name: repositoryName,
        org: organizationName,
        'private': true,
    })).data

    console.log(response.html_url)
}

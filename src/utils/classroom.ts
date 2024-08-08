import { input, select } from '@inquirer/prompts'
import { $, execa } from 'execa'
import { randomUUID } from 'node:crypto'
import { rmSync, writeFileSync } from 'node:fs'
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
    const gradeName = await input({ message: 'Give the grade a name:' }, { clearPromptOnDone: true })

    const organizationName = classroom.organization.login
    const repositoryName = `${assignment.slug}-${slug(gradeName)}-instructor`

    let readMeString = '| Name | ID | Student\'s URL | TA\'s URL |\n| - | - | - | - |\n'

    const acceptedAssignments = await getAcceptedAssignments(assignment.id)

    for (const acceptedAssignment of acceptedAssignments) {
        readMeString += `| ${acceptedAssignment.students[0].login} | ${randomUUID()} | ${acceptedAssignment.repository.html_url} | ${acceptedAssignment.repository.html_url} |\n`
    }

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

    await $`git clone ${response.html_url}`
    writeFileSync(`./${repositoryName}/README.md`, readMeString)
    await $({ cwd: `./${repositoryName}` })`git add README.md`
    await execa({ cwd: `./${repositoryName}` })('git', ['commit', '-am', 'Add README.md'])
    await $({ cwd: `./${repositoryName}` })`git push -u origin main`
    rmSync(`./${repositoryName}`, { force: true, recursive: true })

    console.log(response.html_url)
}

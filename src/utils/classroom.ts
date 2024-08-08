import { input, select } from '@inquirer/prompts'
import { randomUUID } from 'node:crypto'
import { rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Octokit } from 'octokit'
import { simpleGit } from 'simple-git'
import slug from 'slug'

import { getAccessToken } from './auth.js'
import { configDirectoryPath } from './config.js'
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
    const assignmentSlug = assignment.slug
    const gradeSlug = slug(gradeName)

    const octokit = new Octokit({ auth: await getAccessToken() })

    let readMeString = '| Name | ID | Student\'s URL | TA\'s URL |\n| - | - | - | - |\n'

    const acceptedAssignments = await getAcceptedAssignments(assignment.id)

    acceptedAssignments.map(async acceptedAssignment => {
        const id = randomUUID()

        const repositoryName = `${assignmentSlug}-${gradeSlug}-student-${id}`

        const response = (await octokit.request('POST /orgs/{org}/repos', {
            'has_issues': false,
            'has_projects': false,
            'has_wiki': false,
            headers,
            name: repositoryName,
            org: organizationName,
            'private': true,
        })).data

        readMeString += `| ${acceptedAssignment.students[0].login} | ${id} | ${acceptedAssignment.repository.html_url} | ${response.html_url} |\n`

        const repositoryPath = join(configDirectoryPath, 'repo')

        const git = simpleGit()

        await git.cwd(configDirectoryPath)
        await git.clone(acceptedAssignment.repository.html_url, repositoryPath)

        await git.cwd(repositoryPath)

        // await git.addConfig('user.email', 'user@example.com')
        // await git.addConfig('user.name', 'dugit')
        //
        // await git.add('README.md')
        // await git.commit('Generate README.md')
        // await git.push(['-u', 'origin', 'main'])

        await rm(repositoryPath, { force: true, recursive: true })
    })

    const repositoryName = `${assignmentSlug}-${gradeSlug}-instructor`

    const response = (await octokit.request('POST /orgs/{org}/repos', {
        'has_issues': false,
        'has_projects': false,
        'has_wiki': false,
        headers,
        name: repositoryName,
        org: organizationName,
        'private': true,
    })).data

    const repositoryPath = join(configDirectoryPath, 'repo')

    const git = simpleGit()

    await git.cwd(join(configDirectoryPath))
    await git.clone(response.html_url, repositoryPath)

    await writeFile(join(repositoryPath, 'README.md'), readMeString)

    await git.cwd(repositoryPath)

    await git.addConfig('user.email', 'user@example.com')
    await git.addConfig('user.name', 'dugit')

    await git.add('README.md')
    await git.commit('Generate README.md')
    await git.push(['-u', 'origin', 'main'])

    await rm(repositoryPath, { force: true, recursive: true })

    console.log(response.html_url)
}

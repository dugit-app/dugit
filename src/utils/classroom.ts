import { randomUUID } from 'node:crypto'
import { rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Octokit } from 'octokit'
import { simpleGit } from 'simple-git'
import slug from 'slug'

import { getAccessToken, tokenizeURL } from './auth.js'
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

export async function getAssignments(classroomID: number) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /classrooms/{classroom_id}/assignments', {
        'classroom_id': classroomID,
        headers,
    })).data
}

export async function getAssignment(assignmentID: number) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /assignments/{assignment_id}', {
        'assignment_id': assignmentID,
        headers,
    })).data
}

export async function getAcceptedAssignments(assignmentID: number) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /assignments/{assignment_id}/accepted_assignments', {
        'assignment_id': assignmentID,
        headers,
    })).data
}

async function createRepository(name: string, org: string) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('POST /orgs/{org}/repos', {
        'has_issues': false,
        'has_projects': false,
        'has_wiki': false,
        headers,
        name,
        org,
        'private': true,
    })).data
}

async function pushAnonymousRepository(studentURL: string, anonymousURL: string) {
    const repositoryPath = join(configDirectoryPath, 'repo')
    await rm(repositoryPath, { force: true, recursive: true })

    const git = simpleGit()
    await git.cwd(configDirectoryPath)

    await git.clone((await tokenizeURL(studentURL)), repositoryPath)
    await git.cwd(repositoryPath)

    await git.remote(['set-url', '--push', 'origin', (await tokenizeURL(anonymousURL))])

    const branches = await git.branch(['-r'])

    for await (const branch of branches.all) {
        const branchName = branch.slice(branch.search('/') + 1)
        await git.checkout(branchName)

        await git.addConfig('user.email', 'user@example.com')
        await git.addConfig('user.name', 'Anonymous')

        await git.rebase(['-r', '--root', '--exec', 'git commit --amend --no-edit --reset-author'])
    }

    await git.push(['origin', '--all'])

    await rm(repositoryPath, { force: true, recursive: true })

    // eslint-disable-next-line no-warning-comments
    // TODO: Share repo with TA(s)
}

function generateAnonymousID() {
    return randomUUID()
}

async function pushInstructorRepository(URL: string, readMeString: string) {
    const repositoryPath = join(configDirectoryPath, 'repo')
    await rm(repositoryPath, { force: true, recursive: true })

    const git = simpleGit()
    await git.cwd(configDirectoryPath)

    const instructorURL = await tokenizeURL(URL)
    await git.clone(instructorURL, repositoryPath)

    await git.cwd(repositoryPath)

    await git.remote(['set-url', 'origin', instructorURL])

    await git.addConfig('user.email', 'user@example.com')
    await git.addConfig('user.name', 'dugit')

    await writeFile(join(repositoryPath, 'README.md'), readMeString)

    await git.add('README.md')
    await git.commit('Generate README.md')
    await git.push(['-u', 'origin', 'main'])

    await rm(repositoryPath, { force: true, recursive: true })
}

export async function createGradeRepositories(assignmentID: number, gradeName: string) {
    const assignment = await getAssignment(assignmentID)
    const classroom = await getClassroom(assignment.classroom.id)

    const organizationName = classroom.organization.login
    const assignmentSlug = assignment.slug
    const gradeSlug = slug(gradeName)

    let readMeString = '| Name | Student Repo | Anonymous Repo |\n'
    readMeString += '| - | - | - |\n'

    const acceptedAssignments = await getAcceptedAssignments(assignmentID)

    for await (const acceptedAssignment of acceptedAssignments) {
        const id = generateAnonymousID()

        const anonymousRepository = await createRepository(`${assignmentSlug}-${gradeSlug}-student-${id}`, organizationName)
        await pushAnonymousRepository(acceptedAssignment.repository.html_url, anonymousRepository.html_url)

        readMeString += `| ${(acceptedAssignment.students.map(student => student.login)).join(', ')} `
        readMeString += `| [Student repo](${acceptedAssignment.repository.html_url}) `
        readMeString += `| [Anonymous repo](${anonymousRepository.html_url}) |\n`
    }

    const instructorRepository = await createRepository(`${assignmentSlug}-${gradeSlug}-instructor`, organizationName)
    await pushInstructorRepository(instructorRepository.html_url, readMeString)
}

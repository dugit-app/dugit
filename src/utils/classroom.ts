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

    for await (const acceptedAssignment of acceptedAssignments) {
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

        await rm(repositoryPath, { force: true, recursive: true })
        console.log('rm')

        const git = simpleGit()

        await git.cwd(configDirectoryPath)
        console.log('cwd')
        await git.clone(acceptedAssignment.repository.html_url, repositoryPath)
        console.log('clone')

        await git.cwd(repositoryPath)
        console.log('cwd')

        await git.remote(['set-url', '--push', 'origin', response.html_url])
        console.log('remote')

        const defaultBranchName = (await git.branch()).current
        console.log(defaultBranchName)

        const branches = await git.branch(['-r'])
        console.log(branches)

        for await (const branch of branches.all) {
            const branchName = branch.slice(branch.search('/') + 1)

            await git.checkout(branchName)
            console.log(`checkout ${branchName}`)

            await git.addConfig('user.email', 'user@example.com')
            await git.addConfig('user.name', 'Anonymous')
            console.log('config')

            await git.rebase(['-r', '--root', '--exec', 'git commit --amend --no-edit --reset-author'])
            console.log('rebase')
        }

        await git.push(['origin', '--all'])
        console.log('push')

        const branches2 = await git.branch(['-r'])
        console.log(branches2)

        await rm(repositoryPath, { force: true, recursive: true })
        console.log('rm')
    }

    // for await (const acceptedAssignment of acceptedAssignments) {
    //     const id = randomUUID()
    //
    //     const repositoryName = `${assignmentSlug}-${gradeSlug}-student-${id}`
    //
    //     const response = (await octokit.request('POST /orgs/{org}/repos', {
    //         'has_issues': false,
    //         'has_projects': false,
    //         'has_wiki': false,
    //         headers,
    //         name: repositoryName,
    //         org: organizationName,
    //         'private': true,
    //     })).data
    //
    //     readMeString += `| ${acceptedAssignment.students[0].login} | ${id} | ${acceptedAssignment.repository.html_url} | ${response.html_url} |\n`
    //
    //     const repositoryPath = join(configDirectoryPath, 'repo')
    //
    //     await rm(repositoryPath, { force: true, recursive: true })
    //     console.log('rm')
    //
    //     const git = simpleGit()
    //
    //     await git.cwd(configDirectoryPath)
    //     console.log('cwd')
    //     await git.clone(acceptedAssignment.repository.html_url, repositoryPath)
    //     console.log('clone')
    //
    //     await git.cwd(repositoryPath)
    //     console.log('cwd')
    //
    //     await git.remote(['set-url', '--push', 'origin', response.html_url])
    //
    //     await git.addConfig('user.email', 'user@example.com')
    //     await git.addConfig('user.name', 'Anonymous')
    //     console.log('config')
    //
    //     await git.rebase(['-r', '--root', '--exec', 'git commit --amend --no-edit --reset-author'])
    //     console.log('rebase')
    //
    //     await git.push(['--mirror', '--force'])
    //     console.log('push')
    //
    //     await rm(repositoryPath, { force: true, recursive: true })
    //     console.log('rm')
    //
    //     // eslint-disable-next-line no-warning-comments
    //     /*
    //     TODO:
    //      - Change author of all commits
    //      - Set remote to new repo
    //      - Push to new repo
    //      - Share with TA(s)
    //      */
    // }

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

    await git.cwd(configDirectoryPath)
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

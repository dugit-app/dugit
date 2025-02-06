import { Classroom } from '@/api/classroom/classroom.js'
import { addOrganizationMember, getOrganizationMembership } from '@/api/org/org.js'
import { addRepoCollaborator, getRepoPermission } from '@/api/repo/repo.js'
import { userExists } from '@/api/user/user.js'
import { getGraders } from '@/utils/grader/grader.js'
import chalk from 'chalk'
import { Ora } from 'ora'

export async function grantGraderPermissions(repoName: string, org: string, classroom: Classroom, spinner: Ora) {
    const graders = await getGraders(classroom)

    for (const grader of graders) {
        if (!await userExists(grader.username)) {
            spinner.stop()
            console.log(chalk.yellow(`GitHub user with the username ${grader.username} does not exist`))
            spinner.start()
            continue
        }

        const membership = await getOrganizationMembership(org, grader.username)

        if (!membership) {
            await addOrganizationMember(org, grader.username)
        }

        const permission = await getRepoPermission(org, repoName, grader.username)

        if (permission == 'none') {
            await addRepoCollaborator(org, repoName, grader.username, 'write')
        }
    }
}

export async function grantStudentPermissions(username: string, repoName: string, org: string, spinner: Ora) {
    if (!await userExists(username)) {
        spinner.stop()
        console.log(chalk.yellow(`GitHub user with the username ${username} does not exist`))
        spinner.start()
    }

    const membership = await getOrganizationMembership(org, username)

    if (!membership) {
        await addOrganizationMember(org, username)
    }

    const permission = await getRepoPermission(org, repoName, username)

    if (permission == 'none') {
        await addRepoCollaborator(org, repoName, username, 'read')
    }
}

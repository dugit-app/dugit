import { Classroom } from '@/api/classroom/classroom.js'
import { addOrganizationMember, getOrganizationMembership } from '@/api/org/org.js'
import { addRepoCollaborator, getRepoPermission } from '@/api/repo/repo.js'
import { getUser } from '@/api/user/user.js'
import { getGraders } from '@/utils/grader/grader.js'
import chalk from 'chalk'
import { RequestError } from 'octokit'
import { Ora } from 'ora'

export async function grantGraderPermissions(repoName: string, org: string, classroom: Classroom, spinner: Ora) {
    const graders = await getGraders(classroom)

    for (const grader of graders) {
        try {
            await getUser(grader.username)
        } catch (error) {
            if (error instanceof RequestError && error.status == 404) {
                spinner.stop()
                console.log(chalk.yellow(`GitHub user with the username ${grader.username} does not exist`))
                spinner.start()
                continue
            }

            console.log(error)
        }

        const membership = await getOrganizationMembership(org, grader.username)

        if (!membership) {
            await addOrganizationMember(org, grader.username)
        }

        const permission = await getRepoPermission(org, repoName, grader.username)

        if (permission == 'none') {
            await addRepoCollaborator(org, repoName, grader.username, 'triage')
        }
    }
}

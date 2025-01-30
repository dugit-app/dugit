import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'
import { addOrganizationMember, getOrganizationMembership } from '@/api/org.js'
import { addRepoCollaborator, getRepoPermission } from '@/api/repo.js'
import { getUser } from '@/api/user.js'
import { RequestError } from 'octokit'
import chalk from 'chalk'
import { Ora } from 'ora'

export async function grantGraderPermissions(repoName: string, org: string, classroom: Classroom, spinner: Ora) {
    const graders = await utils.graders.get(classroom)

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

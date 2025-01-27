import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'
import { addOrganizationMember, getOrganizationMembership } from '@/api/org.js'
import { addRepoCollaborator, getRepoPermission } from '@/api/repo.js'

export async function grantTaPermissions(repoName: string, org: string, classroom: Classroom) {
    const graders = await utils.graders.get(classroom)

    for await (const grader of graders) {
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

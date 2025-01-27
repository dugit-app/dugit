import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'
import { addOrganizationMember, getOrganizationMembership } from '@/api/org.js'
import { addRepositoryCollaborator, getRepositoryPermission } from '@/api/repo.js'

export async function grantTaPermissions(repoName: string, org: string, classroom: Classroom) {
    const graders = await utils.graders.get(classroom)

    for await (const grader of graders) {
        const membership = await getOrganizationMembership(org, grader.username)

        if (!membership) {
            await addOrganizationMember(org, grader.username)
        }

        const permission = await getRepositoryPermission(org, repoName, grader.username)

        if (permission == 'none') {
            await addRepositoryCollaborator(org, repoName, grader.username, 'triage')
        }
    }
}

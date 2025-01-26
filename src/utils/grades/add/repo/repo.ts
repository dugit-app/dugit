import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'
import { addOrganizationMember, getOrganizationMembership } from '@/api/org.js'
import { addRepositoryCollaborator, getRepositoryPermission } from '@/api/repo.js'

export async function grantTaPermissions(repoName: string, org: string, classroom: Classroom) {
    const tas = await utils.tas.get(classroom)

    for await (const ta of tas) {
        const membership = await getOrganizationMembership(org, ta.username)

        if (!membership) {
            await addOrganizationMember(org, ta.username)
        }

        const permission = await getRepositoryPermission(org, repoName, ta.username)

        if (permission == 'none') {
            await addRepositoryCollaborator(org, repoName, ta.username, 'triage')
        }
    }
}

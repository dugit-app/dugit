import { Classroom } from '@/api/classroom/classroom.js'
import { getConfigRepo } from '@/utils/config/repo/repo.js'

export type Grader = {
    name: string,
    username: string,
}

export async function getGraders(classroom: Classroom) {
    const org = classroom.organization.login
    const configFile = await getConfigRepo(org)
    return configFile.graders
}

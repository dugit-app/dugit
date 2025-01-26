import { Classroom } from '@/api/classroom.js'
import getConfigRepo from '@/utils/configRepo.js'
import { Assignments } from '@/api/assignment.js'

export default async function get(classroom: Classroom) {
    const org = classroom.organization.login
    const configFile = await getConfigRepo(org)
    return configFile.grades
}

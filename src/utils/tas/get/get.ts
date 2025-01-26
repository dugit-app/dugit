import { Classroom } from '@/api/classroom.js'
import getConfigRepo from '@/utils/config/repo/repo.js'

export default async function get(classroom: Classroom) {
    const org = classroom.organization.login
    const configFile = await getConfigRepo(org)
    return configFile.tas
}

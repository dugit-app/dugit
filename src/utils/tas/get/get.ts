import { Classroom } from '@/api/classroom.js'
import { TA } from '@/utils/tas/tas.js'
import api from '@/api/api.js'

export default async function get(classroom: Classroom) {
    const org = classroom.organization.login
    const configFile: { tas: TA[] } = await api.getRepositoryFile(org, 'config.json', 'dugit-config')
    return configFile.tas
}

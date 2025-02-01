import { Classroom } from '@/api/classroom/classroom.js'
import { getConfigRepo } from '@/utils/config/repo/repo.js'

export type Grade = {
    name: string,
    assignmentId: number,
    anonymousNamesMap: {
        studentRepoLink: string,
        studentName: string,
        anonymousName: string,
    }[]
}

export async function getGrades(classroom: Classroom) {
    const org = classroom.organization.login
    const configFile = await getConfigRepo(org)
    return configFile.grades
}

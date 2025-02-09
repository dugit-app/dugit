import { Assignments } from '@/api/assignment/assignment.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { getConfigRepo } from '@/utils/config/repo/repo.js'

export type Grade = {
    name: string,
    assignmentId: number,
    anonymousNamesMap: {
        studentRepoLink: string,
        studentName: string,
        studentUsernames: string[],
        anonymousName: string,
    }[]
}

export async function getGrades(classroom: Classroom, assignment: Assignments[number]) {
    const org = classroom.organization.login
    const configFile = await getConfigRepo(org)
    return (configFile.grades).filter(grade => grade.assignmentId == assignment.id)
}

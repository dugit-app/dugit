import ora from 'ora'

import { Classroom } from '@/api/classroom.js'
import getConfigRepo, { updateConfigRepo } from '@/utils/configRepo.js'
import { Assignments } from '@/api/assignment.js'

export default async function remove(name: string, assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora(`Removing '${name}' from ${assignment.title}`).start()
    const org = classroom.organization.login

    const configRepo = await getConfigRepo(org)

    const gradeExistsIndex = configRepo.grades.findIndex(grade => grade.name === name && grade.assignmentId == assignment.id)

    if (gradeExistsIndex > -1) {
        configRepo.grades.splice(gradeExistsIndex, 1)
    }

    // TODO: Delete repos

    await updateConfigRepo(org, configRepo, `Remove grade from ${assignment.title}`)
    spinner.succeed(`Removed '${name}' from ${assignment.title}`)
}

import { Assignments } from '@/api/assignment.js'
import ora from 'ora'
import getConfigRepo, { updateConfigRepo } from '@/utils/configRepo.js'
import { Classroom } from '@/api/classroom.js'
import { Grade } from '@/utils/grades/grades.js'

export default async function add(name: string, assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora(`Adding grade for '${assignment.title}'`).start()
    const org = classroom.organization.login

    const configRepo = await getConfigRepo(org)

    const gradeExistsIndex = configRepo.grades.findIndex(grade => grade.name === name)

    if (gradeExistsIndex > -1) {
        spinner.fail(`Grade with name '${name}' already exists`)
        return
    }

    // TODO: Add anonymous names
    const grade: Grade = {
        name,
        assignmentId: assignment.id,
        anonymousNameMap: []
    }

    configRepo.grades.push(grade)

    await updateConfigRepo(org, configRepo, `Add grade for '${assignment.title}'`)
    spinner.succeed(`Added grade for '${assignment.title}`)
}

import ora from 'ora'
import slug from 'slug'

import { Classroom } from '@/api/classroom.js'
import getConfigRepo, { updateConfigRepo } from '@/utils/config/repo/repo.js'
import { Assignments } from '@/api/assignment.js'
import { deleteRepository } from '@/api/org.js'

export default async function remove(name: string, assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora(`Removing grade ${name} from ${assignment.title}`).start()
    const org = classroom.organization.login

    const configRepo = await getConfigRepo(org)

    const gradeExistsIndex = configRepo.grades.findIndex(grade => grade.name === name && grade.assignmentId == assignment.id)

    if (gradeExistsIndex == -1) {
        spinner.fail(`Grade '${name} not found`)
        return
    }

    const grade = configRepo.grades[gradeExistsIndex]

    const repoPrefix = `${assignment.slug}-${slug(name)}-`

    spinner.text = 'Deleting teacher repository'
    await deleteRepository(org, repoPrefix + 'teacher')

    spinner.text = 'Deleting teaching assistant repository'
    await deleteRepository(org, repoPrefix + 'teaching-assistant')

    for (const anonymousNameMap of grade.anonymousNamesMap) {
        spinner.text = `Deleting ${anonymousNameMap.studentName}'s anonymous repository`
        await deleteRepository(org, repoPrefix + anonymousNameMap.anonymousName)
    }

    configRepo.grades.splice(gradeExistsIndex, 1)

    await updateConfigRepo(org, configRepo, `Remove grade ${name} from ${assignment.title}`)
    spinner.succeed(`Removed grade ${name} from ${assignment.title}`)
}

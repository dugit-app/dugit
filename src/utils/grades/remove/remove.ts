import ora from 'ora'
import slug from 'slug'
import chalk from 'chalk'

import { Classroom } from '@/api/classroom.js'
import { getConfigRepo, updateConfigRepo } from '@/utils/config/repo/repo.js'
import { Assignments } from '@/api/assignment.js'
import { deleteRepo } from '@/api/repo.js'
import { repoExists } from '@/utils/repos/repos.js'

export default async function remove(name: string, assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora(`Removing grade ${name} from ${assignment.title}`).start()
    const org = classroom.organization.login

    const configRepo = await getConfigRepo(org)

    const gradeExistsIndex = configRepo.grades.findIndex(grade => grade.name === name && grade.assignmentId == assignment.id)

    if (gradeExistsIndex == -1) {
        spinner.fail(`Grade ${name} not found in ${assignment.title}`)
        return
    }

    const grade = configRepo.grades[gradeExistsIndex]

    const repoPrefix = `${assignment.slug}-${slug(name)}-`

    spinner.text = 'Deleting teacher repository'
    if (await repoExists(org, repoPrefix + 'teacher')) {
        await deleteRepo(org, repoPrefix + 'teacher')
    } else {
        spinner.stop()
        console.log(chalk.yellow('Teacher repository does not exist'))
        spinner.start()
    }

    spinner.text = 'Deleting grader repository'
    if (await repoExists(org, repoPrefix + 'grader')) {
        await deleteRepo(org, repoPrefix + 'grader')
    } else {
        spinner.stop()
        console.log(chalk.yellow('Grader repository does not exist'))
        spinner.start()
    }

    for (const anonymousNameMap of grade.anonymousNamesMap) {
        spinner.text = `Deleting ${anonymousNameMap.studentName}'s anonymous repository`
        if (await repoExists(org, repoPrefix + anonymousNameMap.anonymousName)) {
            await deleteRepo(org, repoPrefix + anonymousNameMap.anonymousName)
        } else {
            spinner.stop()
            console.log(chalk.yellow(`Repository for ${anonymousNameMap.anonymousName} does not exist`))
            spinner.start()
        }
    }

    configRepo.grades.splice(gradeExistsIndex, 1)

    await updateConfigRepo(org, configRepo, `Remove grade ${name} from ${assignment.title}`)
    spinner.succeed(`Removed grade ${name} from ${assignment.title}`)
}

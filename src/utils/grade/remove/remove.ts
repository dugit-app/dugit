import { Assignments } from '@/api/assignment/assignment.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { deleteRepo, repoExists } from '@/api/repo/repo.js'
import { getConfigRepo, updateConfigRepo } from '@/utils/config/repo/repo.js'
import chalk from 'chalk'
import ora from 'ora'
import slug from 'slug'

export async function removeGrade(name: string, assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora(`Removing ${name} from ${classroom.name} > ${assignment.title}`).start()
    const org = classroom.organization.login

    const configRepo = await getConfigRepo(org)

    const gradeExistsIndex = configRepo.grades.findIndex(grade => grade.name == name && grade.assignmentId == assignment.id)

    if (gradeExistsIndex == -1) {
        spinner.fail(`${name} does not exist in ${classroom.name} > ${assignment.title}`)
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

    await updateConfigRepo(org, configRepo, `Remove ${name} from ${classroom.name} > ${assignment.title}`)
    spinner.succeed(`Removed ${name} from ${classroom.name} > ${assignment.title}`)
}

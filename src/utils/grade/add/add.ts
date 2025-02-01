import ora from 'ora'
import slug from 'slug'
import chalk from 'chalk'

import { getConfigRepo, updateConfigRepo } from '@/utils/config/repo/repo.js'
import { Assignments, getAcceptedAssignments } from '@/api/assignment/assignment.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { Grade } from '@/utils/grade/grade.js'
import { AnonymousNameGenerator } from '@/utils/grade/add/name/name.js'
import { getReadmes } from '@/utils/grade/add/readme/readme.js'
import { generateAnonymousRepo } from '@/utils/grade/add/repo/anonymous/anonymous.js'
import { generateTeacherRepo } from '@/utils/grade/add/repo/teacher/teacher.js'
import { generateGraderRepo } from '@/utils/grade/add/repo/grader/grader.js'

export async function addGrade(name: string, assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora(`Adding ${name} to ${classroom.name} > ${assignment.title}`).start()
    const org = classroom.organization.login

    const configRepo = await getConfigRepo(org)

    const gradeExistsIndex = configRepo.grades.findIndex(grade => slug(grade.name) === slug(name))

    if (gradeExistsIndex > -1) {
        spinner.fail(`${name} already exists in ${classroom.name} > ${assignment.title}`)
        return
    }

    const anonymousNamesGenerator = new AnonymousNameGenerator()
    const acceptedAssignments = await getAcceptedAssignments(assignment.id)
    acceptedAssignments.forEach(acceptedAssignment => anonymousNamesGenerator.add(acceptedAssignment))
    const anonymousNamesMap = anonymousNamesGenerator.getAnonymousNamesMap()

    await generateAnonymousRepo({
        name,
        assignment,
        classroom,
        org,
        anonymousNamesMap,
        spinner,
    })

    const readmes = getReadmes({
        name,
        assignment,
        org,
        anonymousNamesMap,
    })

    const teacherRepoLink = await generateTeacherRepo({
        name,
        assignment,
        org,
        readme: readmes.teacher,
        spinner,
    })

    await generateGraderRepo({
        name,
        assignment,
        classroom,
        org,
        readme: readmes.grader,
        spinner,
    })

    const grade: Grade = {
        name,
        assignmentId: assignment.id,
        anonymousNamesMap,
    }

    configRepo.grades.push(grade)

    await updateConfigRepo(org, configRepo, `Add ${name} to ${classroom.name} > ${assignment.title}`)
    spinner.succeed(`Added ${name} to ${classroom.name} > ${assignment.title} at ${chalk.cyan(teacherRepoLink)}`)
}

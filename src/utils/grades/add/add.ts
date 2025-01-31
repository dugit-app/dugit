import ora from 'ora'
import slug from 'slug'
import chalk from 'chalk'

import api from '@/api/api.js'
import { getConfigRepo, updateConfigRepo } from '@/utils/config/repo/repo.js'
import { Assignments } from '@/api/assignment.js'
import { Classroom } from '@/api/classroom.js'
import { Grade } from '@/utils/grades/grades.js'
import { AnonymousNameGenerator } from '@/utils/grades/add/name/name.js'
import { getReadmes } from '@/utils/grades/add/readme/readme.js'
import { generateAnonymousRepo } from '@/utils/grades/add/repo/anonymous/anonymous.js'
import { generateTeacherRepo } from '@/utils/grades/add/repo/teacher/teacher.js'
import { generateGraderRepo } from '@/utils/grades/add/repo/grader/grader.js'

export default async function add(name: string, assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora(`Adding ${name} to ${classroom.name} > ${assignment.title}`).start()
    const org = classroom.organization.login

    const configRepo = await getConfigRepo(org)

    const gradeExistsIndex = configRepo.grades.findIndex(grade => slug(grade.name) === slug(name))

    if (gradeExistsIndex > -1) {
        spinner.fail(`${name} already exists in ${classroom.name} > ${assignment.title}`)
        return
    }

    const anonymousNamesGenerator = new AnonymousNameGenerator()
    const acceptedAssignments = await api.getAcceptedAssignments(assignment.id)
    acceptedAssignments.forEach(acceptedAssignment => anonymousNamesGenerator.add(acceptedAssignment))
    const anonymousNamesMap = anonymousNamesGenerator.getAnonymousNamesMap()

    await generateAnonymousRepo({
        name,
        assignment,
        classroom,
        org,
        anonymousNamesMap,
        spinner
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

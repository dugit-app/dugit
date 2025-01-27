import ora from 'ora'
import slug from 'slug'

import { Assignments } from '@/api/assignment.js'
import getConfigRepo, { updateConfigRepo } from '@/utils/config/repo/repo.js'
import { Classroom } from '@/api/classroom.js'
import { Grade } from '@/utils/grades/grades.js'
import api from '@/api/api.js'
import { AnonymousNameGenerator } from '@/utils/grades/add/name/name.js'
import { getReadmes } from '@/utils/grades/add/readme/readme.js'
import { generateAnonymousRepo } from '@/utils/grades/add/repo/anonymous/anonymous.js'
import { generateTeacherRepo } from '@/utils/grades/add/repo/teacher/teacher.js'
import { generateGraderRepo } from '@/utils/grades/add/repo/grader/grader.js'
import chalk from 'chalk'

export default async function add(name: string, assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora(`Adding grade ${name} to ${assignment.title}`).start()
    const org = classroom.organization.login

    const configRepo = await getConfigRepo(org)

    const gradeExistsIndex = configRepo.grades.findIndex(grade => slug(grade.name) === slug(name))

    if (gradeExistsIndex > -1) {
        spinner.fail(`Grade ${name} already exists`)
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

    await updateConfigRepo(org, configRepo, `Add grade ${name} to ${assignment.title}'`)
    spinner.succeed(`Added grade ${name} to ${assignment.title} at ${chalk.cyan(teacherRepoLink)}`)
}

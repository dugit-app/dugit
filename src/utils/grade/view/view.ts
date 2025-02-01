import { Assignments } from '@/api/assignment/assignment.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { Grade } from '@/utils/grade/grade.js'
import chalk from 'chalk'
import slug from 'slug'

export function viewGrade(grade: Grade, assignment: Assignments[number], classroom: Classroom) {
    const org = classroom.organization.login
    console.log(`View teacher repository at ${chalk.cyan(`https://github.com/${org}/${assignment.slug}-${slug(grade.name)}-teacher`)}`)
}

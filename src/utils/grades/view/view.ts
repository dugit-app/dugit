import { Classroom } from '@/api/classroom.js'
import { Assignments } from '@/api/assignment.js'
import { Grade } from '@/utils/grades/grades.js'
import slug from 'slug'
import chalk from 'chalk'

export default function view(grade: Grade, assignment: Assignments[number], classroom: Classroom) {
    const org = classroom.organization.login
    console.log(`View teacher repository at ${chalk.cyan(`https://github.com/${org}/${assignment.slug}-${slug(grade.name)}-teacher`)}`)
}

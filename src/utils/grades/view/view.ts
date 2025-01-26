import { Classroom } from '@/api/classroom.js'
import getConfigRepo from '@/utils/config/repo/repo.js'
import { Assignments } from '@/api/assignment.js'
import { Grade } from '@/utils/grades/grades.js'
import slug from 'slug'

export default function view(grade: Grade, assignment: Assignments[number], classroom: Classroom) {
    const org = classroom.organization.login
    console.log(`View teacher repository at https://github.com/${org}/${assignment.slug}-${slug(grade.name)}-teacher`)
}

import { input } from '@/utils/prompts.js'

import utils from '@/utils/utils.js'
import { Assignments } from '@/api/assignment.js'
import { Classroom } from '@/api/classroom.js'

export default async function add(assignment: Assignments[number], classroom: Classroom) {
    const name = await input('Enter a name for the grade')

    await utils.grades.add(name, assignment, classroom)
}

import { confirm, input } from '@/utils/prompts/prompts.js'

import utils from '@/utils/utils.js'
import { Assignments } from '@/api/assignment.js'
import { Classroom } from '@/api/classroom.js'

export default async function add(assignment: Assignments[number], classroom: Classroom) {
    const name = await input('Enter a name for the grade')

    const confirmAdd = await confirm(`Are you sure you want to add ${name} to ${classroom.name} > ${assignment.title}?`)

    if (confirmAdd) {
        await utils.grades.add(name, assignment, classroom)
    }
}

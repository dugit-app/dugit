import { input } from '@inquirer/prompts'

import utils from '@/utils/utils.js'
import { Assignments } from '@/api/assignment.js'
import { Classroom } from '@/api/classroom.js'

export default async function add(assignment: Assignments[number], classroom: Classroom) {
    const name = await input({ message: 'Enter a name for the grade' }, { clearPromptOnDone: true })

    await utils.grades.add(name, assignment, classroom)
}

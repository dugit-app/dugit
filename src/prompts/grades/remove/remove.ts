import { confirm } from '@inquirer/prompts'

import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'
import { Assignments } from '@/api/assignment.js'
import selectOptions from '@/utils/prompts.js'

export default async function remove(assignment: Assignments[number], classroom: Classroom) {
    const grade = await selectOptions({
        message: 'Select a grade to remove',
        choices: (await utils.grades.get(classroom)).map((grade) => ({
            name: grade.name,
            value: grade,
        })),
        noOptionsMessage: `No grades exist for ${assignment.title}`
    })

    if (!grade) {
        return
    }

    const confirmRemove = await confirm({ message: `Are you sure you want to permanently delete all anonymous repositories for the '${grade.name}' grade?` }, { clearPromptOnDone: true })

    if (confirmRemove) {
        await utils.grades.remove(grade.name, assignment, classroom)
    }
}

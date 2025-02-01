import { confirm, input } from '@/utils/prompts/prompts.js'

import { Classroom } from '@/api/classroom/classroom.js'
import { addGrader } from '@/utils/grader/add/add.js'

export async function addGraderPrompt(classroom: Classroom) {
    const name = await input('Enter the grader\'s name')
    const username = await input('Enter the grader\'s GitHub username')

    const confirmAdd = await confirm(`Are you sure you want to add ${name} to ${classroom.name}?`)

    if (confirmAdd) {
        await addGrader({
            name,
            username,
        }, classroom)
    }
}

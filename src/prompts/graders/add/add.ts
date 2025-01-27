import { input } from '@/utils/prompts/prompts.js'

import utils from '@/utils/utils.js'
import { Classroom } from '@/api/classroom.js'

export default async function add(classroom: Classroom) {
    const name = await input('Enter the grader\'s name')
    const username = await input('Enter the grader\'s GitHub username')

    await utils.graders.add({
        name,
        username
    }, classroom)
}
